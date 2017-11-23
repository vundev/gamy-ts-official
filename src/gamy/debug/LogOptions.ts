/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
module gamy {
    export enum LogLevels{
        VERBOSE,
        NO_LOG
    }

    export class LogOptions {
        public static DEFAULT_LOG:LogOptions
        private _name: string
        private _options: any

        constructor(name: string, options: any = null) {
            this._name = '[' + name + ']'
            this._options = options || {}
        }

        public get name(): string {
            return this._name
        }

        public get options(): any {
            return this._options
        }
    }
}