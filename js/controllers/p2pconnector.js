const p2popts = {
    iceServers: [{ urls: ["stun:stun.gmx.net"] }]
};

class P2PConnection {
    constructor({
        role,
        name,
        channelName,
        onconnectionstatechange = console.log,
        oniceconnectionstatechange = console.log,
        onmessage = console.log,
        oninvite = console.log,
        onstatuschange = console.log,
        inputCode,
        pollEvery = 1000,
        signalSend,    // 3 params: code, type (offer|answer), data
                       // return promise with data 
        signalReceive  // 2 params: code, type (offer|answer)
                       // return promise with data 
    }) {        
        this._status = 'Disconnected';
        this.code = '';
        this.role = role;
        this.name = name;
        this.pollEvery = pollEvery;
        this.onmessage = onmessage;
        this.onstatuschange = onstatuschange;
        this.signalSend = signalSend;
        this.signalReceive = signalReceive;
        
        if (this.role == 'master') {               
            this.oninvite = oninvite.bind(this);
            
            this.connection = new RTCPeerConnection(p2popts);
            this.connection.onicecandidate = (function (e) {
                if (e.candidate == null) {
                    this.code = Array(5).fill(0).map( n => String.fromCharCode((Math.random()*25+65)|0) ).join('');
                    const data = btoa(JSON.stringify(this.connection.localDescription));
                    
                    this.signalSend(this.code, 'offer', data).then((data) => { 
                        this.oninvite(this.code);
                        this.status = 'Waiting answer';
                        this.#pollAnswer.bind(this)(this.code); 
                    });                    
                }
            }).bind(this);
            this.channel = this.connection.createDataChannel(channelName);    
            this.channel.onopen = (ch) => {   
                this.status = 'Connected';
            };
            this.channel.onmessage = this.#receive.bind(this);
            
        } else if (this.role == 'slave') {
            this.connection = new RTCPeerConnection(p2popts);
            this.connection.onicecandidate = (function (e) {
                if (e.candidate == null) {
                    const data = btoa(JSON.stringify(this.connection.localDescription));
                    
                    this.signalSend(this.code, 'answer', data).catch( (e) => console.warn(e) ); 
                    this.status = 'Waiting confirmation';
                }
            }).bind(this);
            
            this.connection.ondatachannel = (e) => {
                this.channel = e.channel || e;
                this.channel.onmessage = this.#receive.bind(this);
                this.status = 'Connected';
            }
            
            this.inputCode = inputCode ?? function() {
                const popover = document.createElement('div');
                popover.popover = 'manual';
                const input = document.createElement('input');
                input.placeholder = 'Paste code here...';
                const button = document.createElement('button');
                button.innerHTML = 'Join';
                const join = function(e) { this.join(e.target.previousElementSibling.value) };  
                button.onclick = join.bind(this);
                popover.appendChild(input);
                popover.appendChild(button);
                document.body.appendChild(popover);
                popover.showPopover();
                this.popover = popover;
            };
        }

        this.connection.onconnectionstatechange = onconnectionstatechange;
        this.connection.oniceconnectionstatechange = oniceconnectionstatechange;
        
        this.onclose = (function() {
            this.status = 'Disconnected';
        }).bind(this);

        this.send = this.send.bind(this);
    }
    
    // getters / setters    
    get status() {
        return this._status;
    }
    set status(val) {
        this.onstatuschange(val);
        this._status = val;
    }
    
    // general methods     
    close() {
        this.connection.close();
    }
    
    send(message) {
        if (typeof(message) == 'string' || typeof(message) == 'number') {            
            message = {
                from: this.name,
                body: message 
            }
        } else if (typeof(message) == 'object') {
            message.from = this.name;
        } else {
            console.warn('Message must be string, number or object');
            return;
        }
        this.channel.send(btoa(JSON.stringify(message)));
    }
    
    #receive(message) {
        message = JSON.parse(atob(message.data));
        this.onmessage(message, this.channel.label);
    }    

    // role master methods
    invite() {
        if (this.status != 'Disconnected') {
            console.warn(`Master ${this.name} must be disconnected!`);
            return;
        }
        this.status = 'Creating offer';
        this.#createOffer();
    }
    
    #createOffer() {
        this.connection.createOffer().then( offer => {
            this.connection.setLocalDescription(offer);
        }).catch( console.warn );
    }

    #acceptAnswer(answer) {
        const answerDesc = new RTCSessionDescription(JSON.parse(answer))
        this.connection.setRemoteDescription(answerDesc);
    }

    #pollAnswer(code) {
        this.signalReceive.bind(this)(code, 'answer').then( answer => {
            if (answer.trim() == '') {
                setTimeout(()=>(this.#pollAnswer.bind(this))(code), this.pollEvery);
            } else {
                this.#acceptAnswer.bind(this)(answer);
            }  
        });
    }
    
    // role slave methods
    join(code) {
        this?.popover?.hidePopover();
        this?.popover?.remove();
        this.popover = null;
        this.code = code;
        this.#getOffer();
    }
    #createAnswer(offer) {
        const offerDesc = new RTCSessionDescription(JSON.parse(offer));
        this.connection.setRemoteDescription(offerDesc);

        this.status = 'Answering';
        this.connection.createAnswer().then( answer => {
            this.connection.setLocalDescription(answer);
        }).catch( console.warn );
    }

    #getOffer() {
        this.status = 'Getting offer';
        this.signalReceive(this.code, 'offer').then( this.#createAnswer.bind(this) );
    }    
}
