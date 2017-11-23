///<reference path="LoaderCore.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
module gamy {
    export class LoaderItem extends LoaderCore {
        protected static _cacheID: number = new Date().getTime()
        public url: string

        constructor(url: string, vars: any = null) {
            super(vars)
            this.url = url
        }

        private getQueryString(query: any): string {
            var queryString: string = '?'
            const keys: Array<any> = Object.keys(query)
            for (var name of keys)
                queryString += name + '=' + query[name] + '&'
            return queryString.substr(0, queryString.length - 1)
        }

        public get completeURL(): string {
            return this.url + this.query
        }

        public get query(): string {
            return this.vars.query != undefined ? this.getQueryString(this.vars.noCache ? new Hash(this.vars.query).merge({gyCacheBusterID: (LoaderItem._cacheID++)}) : this.vars.query) : (this.vars.noCache ? ('?gyCacheBusterID=' + (LoaderItem._cacheID++)) : '')
        }

        public toString(): string {
            return super.toString() + ' url: ' + this.url
        }
    }
}