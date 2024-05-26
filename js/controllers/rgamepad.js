class RGamepad {
    static lastIndex = 100;
    constructor() {
        this.index = RGamepad.lastIndex++;
        this.name = 'RemoteGamepad-'+this.index;
        this.connection = new P2PConnection({
            role: 'master',
            name: this.name,
            channelName: 'vgamepad',
            onmessage: function(mess) {                
                const event = new CustomEvent('rgamepadmessage', {
                    detail: { ...mess }
                });
                window.dispatchEvent(event);
            },
            oninvite: (function(code) {
                this.qrdiv = document.createElement('div');
                this.qrdiv.setAttribute('popover', 'manual');
                document.body.appendChild(this.qrdiv);
                const url = new URL(location.href);
                const qrcode = new QRCode(this.qrdiv, {
                    text: url.protocol + '//' + url.hostname + ':' + url.port + '/vgp.html?code='+code,
                    width: 512,
                    height: 512,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
                this.qrdiv.showPopover();
            }).bind(this),
            onstatuschange: (function(status) {
                console.log(status);
                if (status == 'Connected') {
                    this.qrdiv.remove();
                    const event = new CustomEvent('rgamepadconnected', {
                        detail: {
                            index: this.index,
                            id: this.name,
                            isRemote: true
                        }
                    });
                    window.dispatchEvent(event);
                }
            }).bind(this),
            signalSend: async function(code, type, data) {
                const response = await fetch(`tmp/save.php?filename=${code}.${type}&data=${data}`, {
                    method: 'POST'
                })
                return response.text();
            },
            signalReceive: async function(code, type) {
                const response = await fetch(`tmp/load.php?filename=${code}.${type}`, {
                    method: 'POST'
                })
                return response.text();
            }
        });    
    }

    invite() {
        this.connection.invite();
    }

}