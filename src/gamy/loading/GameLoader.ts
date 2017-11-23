///<reference path="LoaderItem.ts"/>
///<reference path="../utils/GlobalFunctions.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
module gamy {
    export class GameLoader extends LoaderItem {
        protected _documentClassName: string
        protected _script: HTMLScriptElement
        protected _scriptID: string

        constructor(url: string, vars: any = null) {
            super(url, vars)
            this._documentClassName = this.vars.documentClassName
            if (this._documentClassName == undefined)
                throw new Error('Must point to a valid document class name!')
            this._scriptID = NAMESPACE + this.name
        }

        private createScriptElemnt(): void {
            this._script = document.createElement("script")
            this._script.id = this._scriptID
        }

        protected _load(): void {
            const that: GameLoader = this
            this.createScriptElemnt()
            this._script.onload = function (event: any) {
                const definition: any = getDefinitionByName(that._documentClassName)
                that._content = new definition()
                that.completeHandler(event)
            }
            this._script.onerror = function (event: any) {
                that.errorHandler(event)
            }
            this._script.src = this.completeURL
            $("head")[0].appendChild(this._script)
        }

        unload(): void {
            $('#' + this._scriptID).remove()
            super.unload()
        }
    }
}