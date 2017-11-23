///<reference path="LoaderItem.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
module gamy {
    export class JSONLoader extends LoaderItem {
        constructor(url: string, vars: any = null) {
            super(url, vars)
        }

        protected _load(): void {
            const that: JSONLoader = this
            // $.ajax({
            //     cache: true,
            //     dataType: 'json',
            //     url: this.completeURL,
            //     contentType: 'application/json; charset=utf-8',
            //     crossDomain:false,
            //     success: function (data) {
            //         that._content = data
            //         that.parseLoaders(that._content.loaders)
            //         that.completeHandler()
            //     },
            //     error: function (event) {
            //         that.errorHandler(event)
            //     }
            // })

            const request: XMLHttpRequest = new XMLHttpRequest();
            if (request.overrideMimeType) {
                request.overrideMimeType("application/json");
            }
            request.open('GET', this.completeURL, true);
            request.onreadystatechange = function () {
                if (Number(request.readyState) == 4 && String(request.status) == "200") {
                    that._content = JSON.parse(request.responseText)
                    that.parseLoaders(that._content.loaders)
                    that.completeHandler()
                } else {
                    that.errorHandler()
                }
            };
            request.send(null);
        }

        private parseLoaders(config: Array<any>, to?: LoaderMax): void {
            for (var item of config) {
                var definition: any = getDefinitionByName('gamy.' + item.type)
                var loader: LoaderCore = item.type == 'LoaderMax' ? new definition(item.vars) : new definition(item.url, item.vars)
                if (to != undefined)
                    to.append(loader)
                if (item.type == 'LoaderMax')
                    this.parseLoaders(item.children, loader as LoaderMax)
            }
        }
    }
}