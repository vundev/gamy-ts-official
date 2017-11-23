module gamy {

    class ListenerMapItem {
        context: any
        callbacks: Array<Function> = new Array<Function>()

        constructor(context: any, callbacks: Array<Function>) {
            this.context = context
            this.callbacks = callbacks
        }
    }

    export class EventDispatcher implements IEventDispatcher {
        private _listenerMap: Object = {}
        private _target: any

        constructor(target?: any) {
            this._target = target
        }

        public addEventListener(type: string, callback: Function, context?: any): void {
            if (this._listenerMap[type] == undefined) {
                this._listenerMap[type] = new Array<ListenerMapItem>()
            }

            const items: Array<ListenerMapItem> = this._listenerMap[type] as Array<ListenerMapItem>

            const length: number = items.length
            for (var i = 0; i < length; i++)
                if (items[i].context == context) {
                    // if this callback is already registered to that context do nothing
                    if (ArrayTools.has(items[i].callbacks, callback))return
                    // push the callback to already registered context
                    items[i].callbacks.push(callback)
                    return
                }

            items.push(new ListenerMapItem(context, [callback]))
        }

        public hasEventListener(type: string): boolean {
            return this._listenerMap[type] != undefined
        }

        private hasEventListenerForSpecificContext(type: string, context: any, callback: Function): boolean {
            if (this.hasEventListener(type)) {
                const items: Array<ListenerMapItem> = this._listenerMap[type] as Array<ListenerMapItem>;
                const length: number = items.length
                for (var i = 0; i < length; i++) {
                    if (items[i].context == context && ArrayTools.has(items[i].callbacks, callback))
                        return true
                }
            }
            return false
        }

        public dispatchEvent(event: any): void {
            if (typeof event == "string") {
                event = {type: event}
            }
            if (event.target == undefined)
                event.target = this._target || this
            if (this.hasEventListener(event.type)) {
                // Make a copy of the list because during of a listener call, the listener may be removed.
                const items: Array<ListenerMapItem> = (this._listenerMap[event.type] as Array<ListenerMapItem>).concat()
                const l1: number = items.length
                for (var i = 0; i < l1; i++) {
                    const callbacks: Array<Function> = items[i].callbacks.concat()
                    const l2: number = callbacks.length
                    for (var j = 0; j < l2; j++)
                        if (this.hasEventListenerForSpecificContext(event.type, items[i].context, callbacks[j]))
                            callbacks[j].call(items[i].context, event)
                }
            }
        }

        public removeEventListener(type: string, callback: Function, context?: any): void {
            if (this.hasEventListener(type)) {
                const items: Array<ListenerMapItem> = this._listenerMap[type] as Array<ListenerMapItem>
                var length: number = items.length
                for (var i = 0; i < length; i++) {
                    let sameContext: boolean = items[i].context == context
                    if (context && !sameContext)
                        continue

                    let j: number = items[i].callbacks.indexOf(callback)
                    if (j > -1) {
                        items[i].callbacks.splice(j, 1)
                        if (items[i].callbacks.length == 0) {
                            items.splice(i, 1)
                            i--
                            length--
                        }
                    }

                    if (context && sameContext)
                        break
                }

                if (items.length == 0) delete this._listenerMap[type]
            }
        }
    }
}
