///<reference path="../events/EventDispatcher.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
module gamy {
    export enum LoaderStatus{
        READY,
        LOADING,
        COMPLETED,
        FAILED
    }
    export class LoaderCore extends EventDispatcher {
        public name: string
        public vars: any
        protected static _loaderCount: number = 0
        protected static _globalRootLoader: LoaderMax
        protected _content: any
        protected _status: number = LoaderStatus.READY

        constructor(vars: any = null) {
            super()
            this.vars = vars || {}
            this.name = this.vars.name != undefined && this.vars.name != '' ? this.vars.name : ('loader' + (LoaderCore._loaderCount++))

            if (LoaderCore._globalRootLoader == undefined) {
                if (this.vars.__isRoot == true)return
                LoaderCore._globalRootLoader = new LoaderMax({name: 'root', __isRoot: true})
            }

            if (this != LoaderCore._globalRootLoader)LoaderCore._globalRootLoader.append(this)
        }

        public load(): void {
            if (this._status == LoaderStatus.FAILED)
                this.unload()

            if (this._status == LoaderStatus.READY) {
                this._status = LoaderStatus.LOADING
                this._load()
                this.dispatchEvent(new LoaderEvent(LoaderEvent.OPEN, this))
            } else if (this._status == LoaderStatus.COMPLETED)
                this.completeHandler()
        }

        protected _load(): void {

        }

        public unload(): void {
            this._content = null
            const oldStatus: number = this._status
            this._status = LoaderStatus.READY
            if (oldStatus == LoaderStatus.COMPLETED)
                this.dispatchEvent(new LoaderEvent(LoaderEvent.UNLOAD))
        }

        protected completeHandler(event: any = null): void {
            this._status = LoaderStatus.COMPLETED
            this.dispatchEvent(new LoaderEvent(LoaderEvent.COMPLETE))
        }

        protected errorHandler(event: any = null): void {
            this._status = LoaderStatus.FAILED
            this.dispatchEvent(new LoaderEvent(LoaderEvent.FAIL))
        }

        public toString(): string {
            return this.name
        }

        public get status(): number {
            return this._status
        }

        public get content(): any {
            return this._content
        }
    }
}