/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
module gamy {
    export class Hash {
        public static className: string = 'gamy.Hash'

        constructor(object: Object = null) {
            if (object)this.merge(object)
        }

        public merge(object: Object, recursive: boolean = true): Hash {
            if (object == undefined)return this
            const keys: Array<any> = Object.keys(object)
            for (var name of keys) {
                if (object[name] !== null) {
                    //trace('=>', name, recursive, this.instanceIsObjOrHash(this[name]), this.instanceIsObjOrHash(object[name]), this[name], object[name])
                    if (recursive && this.instanceIsObjOrHash(this[name]) && this.instanceIsObjOrHash(object[name]))
                        this[name] = new Hash(this[name]).merge(object[name], recursive)
                    else this[name] = object[name]
                }
            }
            return this
        }

        private instanceIsObjOrHash(instance: any): boolean {
            return instance != undefined && (instance.constructor.name === 'Object' || instance.constructor.className === Hash.className)
        }

        public toString(): string {
            const out: Array<any> = []
            const keys: Array<any> = Object.keys(this)
            //trace('=>', ArrayTools.print(keys))
            for (var name of keys) {
                if (this[name] instanceof Array) out.push(name + ': ' + ArrayTools.print(this[name]));
                else out.push(name + ': ' + (this.instanceIsObjOrHash(this[name]) ? new Hash(this[name]).toString() : this[name]))
                //trace('=>', name, this[name])
            }
            return '{' + out.join(', ') + '}'
        }

        public isEmpty(): boolean {
            return Object.keys(this).length == 0
        }

        public has(...rest): boolean {
            for (var needle of rest) {
                if (needle instanceof Array && this.has.apply(this, needle))return true
                else if (this[needle] !== undefined)return true
            }
            return false
        }

        public get length(): number {
            return Object.keys(this).length
        }

        public get values(): Array<any> {
            const v: Array<any> = []
            const keys: Array<string> = Object.keys(this)
            for (var name of keys)v.push(this[name])
            return v;
        }

        public diff(other: any): Hash {
            const h: Hash = new Hash()
            const keys: Array<string> = Object.keys(this)
            for (var name of keys) {
                if (other[name] === undefined || other[name] != this[name])h[name] = this[name]
            }
            return h
        }

        public mapValues(callback: (k?: any, v?: any)=>any): Hash {
            const h: Hash = new Hash()
            const keys: Array<string> = Object.keys(this)
            for (var name of keys)
                h[name] = callback(name, this[name])
            return h
        }

        public dup(): Hash {
            return new Hash(this)
        }

        public withoutKeys(...args): Hash {
            const keys: Array<any> = args[0] instanceof Array ? args[0] : args
            const h: Hash = new Hash()
            this.forEach(function (k: any, v: any) {
                if (keys.indexOf(k) < 0)
                    h[k] = this[k]
            })
            return h
        }

        public forEach(check: (k: any, v: any)=>void): void {
            const keys: Array<string> = Object.keys(this)
            for (var name of keys)
                check.call(this, name, this[name])
        }

        public toObject(): Object {
            var object: any = {}
            this.forEach(function (k: any, v: any) {
                object[k] = this[k]
            })
            return object
        }
    }
}