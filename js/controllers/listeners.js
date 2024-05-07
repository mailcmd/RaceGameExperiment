
class ListenersManager {
    static instancesCount = 0;  
    static realAddEventListener;
    static realRemoveEventListener;
    static currentStatus = [];
    static savedStatuses = [];
    
    constructor () {
        if (ListenersManager.instancesCount > 0) {
            throw new Error('You cant instantiate more than one ListenersManager!');            
        }
        ListenersManager.instancesCount++;
        ListenersManager.realAddEventListener = EventTarget.prototype.addEventListener;
        ListenersManager.realRemoveEventListener = EventTarget.prototype.removeEventListener;
        EventTarget.prototype.addEventListener = ListenersManager.addEventListener;
        EventTarget.prototype.removeEventListener = ListenersManager.removeEventListener;

        ListenersManager.currentStatus = [];
        ListenersManager.savedStatuses = [];
    }
    
    static addEventListener(eventName, handler, ...extra) {
        ListenersManager.realAddEventListener.call(this, eventName, handler, ...extra);
        ListenersManager.currentStatus.push( { domObject: this, eventName, handler, extra } );
        return ListenersManager.currentStatus.length;
    }
    
    static removeEventListener(eventName, handler, ...extra) {
        ListenersManager.realRemoveEventListener.call(this, eventName, handler, ...extra);
        const idx = ListenersManager.currentStatus.findIndex( d => d.domObject == this && d.eventName == eventName && d.handler == handler && JSON.stringify(d.extra) == JSON.stringify(...extra) );
        ListenersManager.currentStatus.splice(idx, 1);
    }
    
    save() {
        ListenersManager.savedStatuses.push( ListenersManager.currentStatus.slice(0) );
        this.#removeAll();
    }
    
    restore() {
        this.#removeAll();
        const currentStatus = ListenersManager.savedStatuses.pop();
        currentStatus.forEach( ({domObject, eventName, handler, extra}) => domObject.addEventListener(eventName, handler, extra) );    
    }

    #removeAll() {
        while (ListenersManager.currentStatus.length) {
            const {domObject, eventName, handler, extra} = ListenersManager.currentStatus[0];
            domObject.removeEventListener(eventName, handler, extra);
        }
    }        
}

