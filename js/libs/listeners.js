class ListenersManager {
    constructor () {
        this.currentStatus = [];
        this.savedStatuses = [];
    }
    
    addEventListener(domObject, eventName, handler, extra) {
        domObject.addEventListener(eventName, handler, extra);
        this.currentStatus.push( { domObject, eventName, handler, extra } );
        return this.currentStatus.length;
    }
    
    removeEventListener(domObject, eventName, handler, extra) {
        domObject.removeEventListener(eventName, handler, extra);
        const idx = this.currentStatus.findIndex( d => d.domObject == domObject && d.eventName == eventName && d.handler == handler && JSON.stringify(d.extra) == JSON.stringify(extra) );
        return this.currentStatus.splice(idx, 1);
    }
    
    save() {
        this.savedStatuses.push( this.currentStatus.slice(0) );
        this.removeAll();
    }
    
    restore() {
        this.currentStatus.forEach( ({domObject, eventName, handler, extra}) => domObject.removeEventListener(eventName, handler, extra) );
        this.currentStatus = this.savedStatuses.pop();
        this.currentStatus.forEach( ({domObject, eventName, handler, extra}) => domObject.addEventListener(eventName, handler, extra) );    
    }

    removeAll() {
        this.currentStatus.forEach( ({domObject, eventName, handler, extra}) => domObject.removeEventListener(eventName, handler, extra) );
        this.currentStatus = [];
    }    
    
}