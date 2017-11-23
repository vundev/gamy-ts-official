///<reference path="LoaderCore.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
module gamy {
    export class LoaderMax extends LoaderCore {
        private _loaders: Array<LoaderCore> = []
        private _completeLoadersCount: number = 0
        protected _prependURLs: string

        constructor(vars: any = null) {
            super(vars)
            this._prependURLs = this.vars.prependURLs != undefined ? this.vars.prependURLs : ''
        }

        protected _load(): void {
            const length: number = this._loaders.length
            for (var i = 0; i < length; i++)
                this._loaders[i].load()
        }

        protected completeChildHandler(event: LoaderEvent): void {
            this._completeLoadersCount++
            this.dispatchEvent(new LoaderEvent(LoaderEvent.CHILD_COMPLETE, event.target))
            if (this._completeLoadersCount == this._loaders.length) {
                if (this._status == LoaderStatus.FAILED)
                    this.errorHandler()
                else this.completeHandler()
            }
        }

        protected  errorChildHandler(event: LoaderEvent): void {
            this._completeLoadersCount++
            this._status = LoaderStatus.FAILED
            this.dispatchEvent(new LoaderEvent(LoaderEvent.CHILD_FAIL, event.target))
            if (this._completeLoadersCount == this._loaders.length)
                this.errorHandler()
        }

        protected unloadChildHandler(event: LoaderEvent): void {
            this._completeLoadersCount--
        }

        protected openChildHandler(event: LoaderEvent): void {
            this.dispatchEvent(new LoaderEvent(LoaderEvent.CHILD_OPEN, event.target))
        }

        public append(loader: LoaderCore): LoaderCore {
            if (ArrayTools.has(this._loaders, loader))return null

            if (loader instanceof LoaderItem)
                (loader as LoaderItem).url = this._prependURLs + (loader as LoaderItem).url

            this._loaders.push(loader)
            loader.addEventListener(LoaderEvent.COMPLETE, this.completeChildHandler, this)
            loader.addEventListener(LoaderEvent.FAIL, this.errorChildHandler, this)
            loader.addEventListener(LoaderEvent.UNLOAD, this.unloadChildHandler, this)
            loader.addEventListener(LoaderEvent.OPEN, this.openChildHandler, this)
            return loader
        }

        public getLoader(nameOrURL: string): any {
            var i: number = this._loaders.length;
            var loader: LoaderCore;
            while (--i > -1) {
                loader = this._loaders[i];
                if (loader.name == nameOrURL || (loader instanceof LoaderItem && (loader as LoaderItem).url == nameOrURL)) {
                    return loader;
                } else if (loader.hasOwnProperty("getLoader")) {
                    loader = (loader as any).getLoader(nameOrURL) as LoaderCore;
                    if (loader != null) {
                        return loader;
                    }
                }
            }
            return null;
        }

        public getContent(nameOrURL: string): any {
            const loader: LoaderCore = this.getLoader(nameOrURL);
            return (loader != null) ? loader.content : null;
        }

        public static getContent(nameOrURL: string): any {
            return (LoaderCore._globalRootLoader != undefined) ? LoaderCore._globalRootLoader.getContent(nameOrURL) : null;
        }

        public static getLoader(nameOrURL: string): any {
            return (LoaderCore._globalRootLoader != undefined) ? LoaderCore._globalRootLoader.getLoader(nameOrURL) : null;
        }

        public static print(): void {
            if (LoaderCore._globalRootLoader != undefined) {
                trace('--- all loaders ---')
                const length: number = LoaderCore._globalRootLoader._loaders.length
                for (var i = 0; i < length; i++)
                    trace(LoaderCore._globalRootLoader._loaders[i])
                trace('--- end of loaders ---')
            }
        }

        public get content(): any {
            const a: Array<any> = [];
            var i: number = this._loaders.length;
            while (--i > -1)
                a[i] = this._loaders[i].content;
            return a;
        }

        public get numChildren(): number {
            return this._loaders.length
        }

        public get status(): number {
            const length: number = this._loaders.length
            for (var i = 0; i < length; i++) {
                if (this._loaders[i].status == LoaderStatus.LOADING)return LoaderStatus.LOADING
            }
            return this._status
        }
    }
}