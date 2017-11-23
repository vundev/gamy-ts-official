var gamy;
(function (gamy) {
    gamy.version = VERSION;
})(gamy || (gamy = {}));
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    (function (LogLevels) {
        LogLevels[LogLevels["VERBOSE"] = 0] = "VERBOSE";
        LogLevels[LogLevels["NO_LOG"] = 1] = "NO_LOG";
    })(gamy.LogLevels || (gamy.LogLevels = {}));
    var LogLevels = gamy.LogLevels;
    var LogOptions = (function () {
        function LogOptions(name, options) {
            if (options === void 0) { options = null; }
            this._name = '[' + name + ']';
            this._options = options || {};
        }
        Object.defineProperty(LogOptions.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LogOptions.prototype, "options", {
            get: function () {
                return this._options;
            },
            enumerable: true,
            configurable: true
        });
        return LogOptions;
    })();
    gamy.LogOptions = LogOptions;
})(gamy || (gamy = {}));
var gamy;
(function (gamy) {
    var ListenerMapItem = (function () {
        function ListenerMapItem(context, callbacks) {
            this.callbacks = new Array();
            this.context = context;
            this.callbacks = callbacks;
        }
        return ListenerMapItem;
    })();
    var EventDispatcher = (function () {
        function EventDispatcher(target) {
            this._listenerMap = {};
            this._target = target;
        }
        EventDispatcher.prototype.addEventListener = function (type, callback, context) {
            if (this._listenerMap[type] == undefined) {
                this._listenerMap[type] = new Array();
            }
            var items = this._listenerMap[type];
            var length = items.length;
            for (var i = 0; i < length; i++)
                if (items[i].context == context) {
                    // if this callback is already registered to that context do nothing
                    if (gamy.ArrayTools.has(items[i].callbacks, callback))
                        return;
                    // push the callback to already registered context
                    items[i].callbacks.push(callback);
                    return;
                }
            items.push(new ListenerMapItem(context, [callback]));
        };
        EventDispatcher.prototype.hasEventListener = function (type) {
            return this._listenerMap[type] != undefined;
        };
        EventDispatcher.prototype.hasEventListenerForSpecificContext = function (type, context, callback) {
            if (this.hasEventListener(type)) {
                var items = this._listenerMap[type];
                var length_1 = items.length;
                for (var i = 0; i < length_1; i++) {
                    if (items[i].context == context && gamy.ArrayTools.has(items[i].callbacks, callback))
                        return true;
                }
            }
            return false;
        };
        EventDispatcher.prototype.dispatchEvent = function (event) {
            if (typeof event == "string") {
                event = { type: event };
            }
            if (event.target == undefined)
                event.target = this._target || this;
            if (this.hasEventListener(event.type)) {
                // Make a copy of the list because during of a listener call, the listener may be removed.
                var items = this._listenerMap[event.type].concat();
                var l1 = items.length;
                for (var i = 0; i < l1; i++) {
                    var callbacks = items[i].callbacks.concat();
                    var l2 = callbacks.length;
                    for (var j = 0; j < l2; j++)
                        if (this.hasEventListenerForSpecificContext(event.type, items[i].context, callbacks[j]))
                            callbacks[j].call(items[i].context, event);
                }
            }
        };
        EventDispatcher.prototype.removeEventListener = function (type, callback, context) {
            if (this.hasEventListener(type)) {
                var items = this._listenerMap[type];
                var length = items.length;
                for (var i = 0; i < length; i++) {
                    var sameContext = items[i].context == context;
                    if (context && !sameContext)
                        continue;
                    var j = items[i].callbacks.indexOf(callback);
                    if (j > -1) {
                        items[i].callbacks.splice(j, 1);
                        if (items[i].callbacks.length == 0) {
                            items.splice(i, 1);
                            i--;
                            length--;
                        }
                    }
                    if (context && sameContext)
                        break;
                }
                if (items.length == 0)
                    delete this._listenerMap[type];
            }
        };
        return EventDispatcher;
    })();
    gamy.EventDispatcher = EventDispatcher;
})(gamy || (gamy = {}));
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    var LoaderEvent = (function () {
        function LoaderEvent(type, target) {
            if (target === void 0) { target = null; }
            this.type = type;
            this.target = target;
        }
        LoaderEvent.COMPLETE = 'complete';
        LoaderEvent.FAIL = 'fail';
        LoaderEvent.CHILD_COMPLETE = 'childComplete';
        LoaderEvent.CHILD_FAIL = 'childFail';
        LoaderEvent.CHILD_OPEN = 'childOpen';
        LoaderEvent.UNLOAD = 'unload';
        LoaderEvent.OPEN = 'open';
        return LoaderEvent;
    })();
    gamy.LoaderEvent = LoaderEvent;
})(gamy || (gamy = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../events/EventDispatcher.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    (function (LoaderStatus) {
        LoaderStatus[LoaderStatus["READY"] = 0] = "READY";
        LoaderStatus[LoaderStatus["LOADING"] = 1] = "LOADING";
        LoaderStatus[LoaderStatus["COMPLETED"] = 2] = "COMPLETED";
        LoaderStatus[LoaderStatus["FAILED"] = 3] = "FAILED";
    })(gamy.LoaderStatus || (gamy.LoaderStatus = {}));
    var LoaderStatus = gamy.LoaderStatus;
    var LoaderCore = (function (_super) {
        __extends(LoaderCore, _super);
        function LoaderCore(vars) {
            if (vars === void 0) { vars = null; }
            _super.call(this);
            this._status = LoaderStatus.READY;
            this.vars = vars || {};
            this.name = this.vars.name != undefined && this.vars.name != '' ? this.vars.name : ('loader' + (LoaderCore._loaderCount++));
            if (LoaderCore._globalRootLoader == undefined) {
                if (this.vars.__isRoot == true)
                    return;
                LoaderCore._globalRootLoader = new gamy.LoaderMax({ name: 'root', __isRoot: true });
            }
            if (this != LoaderCore._globalRootLoader)
                LoaderCore._globalRootLoader.append(this);
        }
        LoaderCore.prototype.load = function () {
            if (this._status == LoaderStatus.FAILED)
                this.unload();
            if (this._status == LoaderStatus.READY) {
                this._status = LoaderStatus.LOADING;
                this._load();
                this.dispatchEvent(new gamy.LoaderEvent(gamy.LoaderEvent.OPEN, this));
            }
            else if (this._status == LoaderStatus.COMPLETED)
                this.completeHandler();
        };
        LoaderCore.prototype._load = function () {
        };
        LoaderCore.prototype.unload = function () {
            this._content = null;
            var oldStatus = this._status;
            this._status = LoaderStatus.READY;
            if (oldStatus == LoaderStatus.COMPLETED)
                this.dispatchEvent(new gamy.LoaderEvent(gamy.LoaderEvent.UNLOAD));
        };
        LoaderCore.prototype.completeHandler = function (event) {
            if (event === void 0) { event = null; }
            this._status = LoaderStatus.COMPLETED;
            this.dispatchEvent(new gamy.LoaderEvent(gamy.LoaderEvent.COMPLETE));
        };
        LoaderCore.prototype.errorHandler = function (event) {
            if (event === void 0) { event = null; }
            this._status = LoaderStatus.FAILED;
            this.dispatchEvent(new gamy.LoaderEvent(gamy.LoaderEvent.FAIL));
        };
        LoaderCore.prototype.toString = function () {
            return this.name;
        };
        Object.defineProperty(LoaderCore.prototype, "status", {
            get: function () {
                return this._status;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoaderCore.prototype, "content", {
            get: function () {
                return this._content;
            },
            enumerable: true,
            configurable: true
        });
        LoaderCore._loaderCount = 0;
        return LoaderCore;
    })(gamy.EventDispatcher);
    gamy.LoaderCore = LoaderCore;
})(gamy || (gamy = {}));
///<reference path="LoaderCore.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    var LoaderItem = (function (_super) {
        __extends(LoaderItem, _super);
        function LoaderItem(url, vars) {
            if (vars === void 0) { vars = null; }
            _super.call(this, vars);
            this.url = url;
        }
        LoaderItem.prototype.getQueryString = function (query) {
            var queryString = '?';
            var keys = Object.keys(query);
            for (var _i = 0; _i < keys.length; _i++) {
                var name = keys[_i];
                queryString += name + '=' + query[name] + '&';
            }
            return queryString.substr(0, queryString.length - 1);
        };
        Object.defineProperty(LoaderItem.prototype, "completeURL", {
            get: function () {
                return this.url + this.query;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoaderItem.prototype, "query", {
            get: function () {
                return this.vars.query != undefined ? this.getQueryString(this.vars.noCache ? new gamy.Hash(this.vars.query).merge({ gyCacheBusterID: (LoaderItem._cacheID++) }) : this.vars.query) : (this.vars.noCache ? ('?gyCacheBusterID=' + (LoaderItem._cacheID++)) : '');
            },
            enumerable: true,
            configurable: true
        });
        LoaderItem.prototype.toString = function () {
            return _super.prototype.toString.call(this) + ' url: ' + this.url;
        };
        LoaderItem._cacheID = new Date().getTime();
        return LoaderItem;
    })(gamy.LoaderCore);
    gamy.LoaderItem = LoaderItem;
})(gamy || (gamy = {}));
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    gamy.NAMESPACE = 'gamy';
    function getDefinitionByName(name) {
        var package = name.split('.');
        try {
            var constr = window;
            var length_2 = package.length;
            for (var i = 0; i < length_2; i++)
                constr = constr[package[i]];
            return constr;
        }
        catch (error) {
            return null;
        }
    }
    gamy.getDefinitionByName = getDefinitionByName;
    function trace() {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i - 0] = arguments[_i];
        }
        if (DEBUG) {
            var diffFromDefault = false;
            if (rest[0] instanceof gamy.LogOptions) {
                diffFromDefault = true;
                var options = rest[0];
                if (options.options.level == gamy.LogLevels.NO_LOG)
                    return;
                else if (options.options.level == gamy.LogLevels.VERBOSE)
                    rest[0] = options.name;
            }
            else if (gamy.LogOptions.DEFAULT_LOG != null) {
                options = gamy.LogOptions.DEFAULT_LOG;
                if (options.options.level == gamy.LogLevels.NO_LOG)
                    return;
            }
            var result = [];
            var length_3 = rest.length;
            for (var i = 0; i < length_3; i++) {
                var toStringCondition = void 0;
                try {
                    toStringCondition = rest[i].toString instanceof Function;
                }
                catch (error) {
                    toStringCondition = false;
                }
                result[i] = (toStringCondition ? rest[i].toString() : rest[i]);
            }
            if (!diffFromDefault && gamy.LogOptions.DEFAULT_LOG != null)
                result.unshift(gamy.LogOptions.DEFAULT_LOG.name);
            console.log('=== ' + gamy.StringTools.digitalTime() + ' ==='); // If you skip this string you will triger an issue with the console causing unexpected print output
            console.log.apply(console, result);
        }
    }
    gamy.trace = trace;
    function log(useConsoleLogOrTrace) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (useConsoleLogOrTrace) {
            if (DEBUG) {
                console.log.apply(console, rest);
            }
        }
        else {
            trace.apply(null, rest);
        }
    }
    gamy.log = log;
    var conditionMap = {};
    var ConditionMapItem = (function () {
        function ConditionMapItem(ts, time) {
            this.ts = ts;
            this.time = time;
        }
        return ConditionMapItem;
    })();
    function setCondition(time) {
        var id = gamy.GUID.create();
        conditionMap[id] = new ConditionMapItem(0, time);
        return id;
    }
    gamy.setCondition = setCondition;
    function checkCondition(id) {
        var data = conditionMap[id];
        var newts = new Date().getTime();
        var oldts = data.ts;
        data.ts = newts;
        return newts - oldts < data.time;
    }
    gamy.checkCondition = checkCondition;
    function clearCondition(id) {
        delete conditionMap[id];
    }
    gamy.clearCondition = clearCondition;
    function isMobile() {
        if (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        }
        else {
            return false;
        }
    }
    gamy.isMobile = isMobile;
})(gamy || (gamy = {}));
///<reference path="LoaderItem.ts"/>
///<reference path="../utils/GlobalFunctions.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    var GameLoader = (function (_super) {
        __extends(GameLoader, _super);
        function GameLoader(url, vars) {
            if (vars === void 0) { vars = null; }
            _super.call(this, url, vars);
            this._documentClassName = this.vars.documentClassName;
            if (this._documentClassName == undefined)
                throw new Error('Must point to a valid document class name!');
            this._scriptID = gamy.NAMESPACE + this.name;
        }
        GameLoader.prototype.createScriptElemnt = function () {
            this._script = document.createElement("script");
            this._script.id = this._scriptID;
        };
        GameLoader.prototype._load = function () {
            var that = this;
            this.createScriptElemnt();
            this._script.onload = function (event) {
                var definition = gamy.getDefinitionByName(that._documentClassName);
                that._content = new definition();
                that.completeHandler(event);
            };
            this._script.onerror = function (event) {
                that.errorHandler(event);
            };
            this._script.src = this.completeURL;
            $("head")[0].appendChild(this._script);
        };
        GameLoader.prototype.unload = function () {
            $('#' + this._scriptID).remove();
            _super.prototype.unload.call(this);
        };
        return GameLoader;
    })(gamy.LoaderItem);
    gamy.GameLoader = GameLoader;
})(gamy || (gamy = {}));
///<reference path="LoaderItem.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    var JSONLoader = (function (_super) {
        __extends(JSONLoader, _super);
        function JSONLoader(url, vars) {
            if (vars === void 0) { vars = null; }
            _super.call(this, url, vars);
        }
        JSONLoader.prototype._load = function () {
            var that = this;
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
            var request = new XMLHttpRequest();
            if (request.overrideMimeType) {
                request.overrideMimeType("application/json");
            }
            request.open('GET', this.completeURL, true);
            request.onreadystatechange = function () {
                if (Number(request.readyState) == 4 && String(request.status) == "200") {
                    that._content = JSON.parse(request.responseText);
                    that.parseLoaders(that._content.loaders);
                    that.completeHandler();
                }
                else {
                    that.errorHandler();
                }
            };
            request.send(null);
        };
        JSONLoader.prototype.parseLoaders = function (config, to) {
            for (var _i = 0; _i < config.length; _i++) {
                var item = config[_i];
                var definition = gamy.getDefinitionByName('gamy.' + item.type);
                var loader = item.type == 'LoaderMax' ? new definition(item.vars) : new definition(item.url, item.vars);
                if (to != undefined)
                    to.append(loader);
                if (item.type == 'LoaderMax')
                    this.parseLoaders(item.children, loader);
            }
        };
        return JSONLoader;
    })(gamy.LoaderItem);
    gamy.JSONLoader = JSONLoader;
})(gamy || (gamy = {}));
///<reference path="LoaderCore.ts"/>
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    var LoaderMax = (function (_super) {
        __extends(LoaderMax, _super);
        function LoaderMax(vars) {
            if (vars === void 0) { vars = null; }
            _super.call(this, vars);
            this._loaders = [];
            this._completeLoadersCount = 0;
            this._prependURLs = this.vars.prependURLs != undefined ? this.vars.prependURLs : '';
        }
        LoaderMax.prototype._load = function () {
            var length = this._loaders.length;
            for (var i = 0; i < length; i++)
                this._loaders[i].load();
        };
        LoaderMax.prototype.completeChildHandler = function (event) {
            this._completeLoadersCount++;
            this.dispatchEvent(new gamy.LoaderEvent(gamy.LoaderEvent.CHILD_COMPLETE, event.target));
            if (this._completeLoadersCount == this._loaders.length) {
                if (this._status == gamy.LoaderStatus.FAILED)
                    this.errorHandler();
                else
                    this.completeHandler();
            }
        };
        LoaderMax.prototype.errorChildHandler = function (event) {
            this._completeLoadersCount++;
            this._status = gamy.LoaderStatus.FAILED;
            this.dispatchEvent(new gamy.LoaderEvent(gamy.LoaderEvent.CHILD_FAIL, event.target));
            if (this._completeLoadersCount == this._loaders.length)
                this.errorHandler();
        };
        LoaderMax.prototype.unloadChildHandler = function (event) {
            this._completeLoadersCount--;
        };
        LoaderMax.prototype.openChildHandler = function (event) {
            this.dispatchEvent(new gamy.LoaderEvent(gamy.LoaderEvent.CHILD_OPEN, event.target));
        };
        LoaderMax.prototype.append = function (loader) {
            if (gamy.ArrayTools.has(this._loaders, loader))
                return null;
            if (loader instanceof gamy.LoaderItem)
                loader.url = this._prependURLs + loader.url;
            this._loaders.push(loader);
            loader.addEventListener(gamy.LoaderEvent.COMPLETE, this.completeChildHandler, this);
            loader.addEventListener(gamy.LoaderEvent.FAIL, this.errorChildHandler, this);
            loader.addEventListener(gamy.LoaderEvent.UNLOAD, this.unloadChildHandler, this);
            loader.addEventListener(gamy.LoaderEvent.OPEN, this.openChildHandler, this);
            return loader;
        };
        LoaderMax.prototype.getLoader = function (nameOrURL) {
            var i = this._loaders.length;
            var loader;
            while (--i > -1) {
                loader = this._loaders[i];
                if (loader.name == nameOrURL || (loader instanceof gamy.LoaderItem && loader.url == nameOrURL)) {
                    return loader;
                }
                else if (loader.hasOwnProperty("getLoader")) {
                    loader = loader.getLoader(nameOrURL);
                    if (loader != null) {
                        return loader;
                    }
                }
            }
            return null;
        };
        LoaderMax.prototype.getContent = function (nameOrURL) {
            var loader = this.getLoader(nameOrURL);
            return (loader != null) ? loader.content : null;
        };
        LoaderMax.getContent = function (nameOrURL) {
            return (gamy.LoaderCore._globalRootLoader != undefined) ? gamy.LoaderCore._globalRootLoader.getContent(nameOrURL) : null;
        };
        LoaderMax.getLoader = function (nameOrURL) {
            return (gamy.LoaderCore._globalRootLoader != undefined) ? gamy.LoaderCore._globalRootLoader.getLoader(nameOrURL) : null;
        };
        LoaderMax.print = function () {
            if (gamy.LoaderCore._globalRootLoader != undefined) {
                gamy.trace('--- all loaders ---');
                var length_4 = gamy.LoaderCore._globalRootLoader._loaders.length;
                for (var i = 0; i < length_4; i++)
                    gamy.trace(gamy.LoaderCore._globalRootLoader._loaders[i]);
                gamy.trace('--- end of loaders ---');
            }
        };
        Object.defineProperty(LoaderMax.prototype, "content", {
            get: function () {
                var a = [];
                var i = this._loaders.length;
                while (--i > -1)
                    a[i] = this._loaders[i].content;
                return a;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoaderMax.prototype, "numChildren", {
            get: function () {
                return this._loaders.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoaderMax.prototype, "status", {
            get: function () {
                var length = this._loaders.length;
                for (var i = 0; i < length; i++) {
                    if (this._loaders[i].status == gamy.LoaderStatus.LOADING)
                        return gamy.LoaderStatus.LOADING;
                }
                return this._status;
            },
            enumerable: true,
            configurable: true
        });
        return LoaderMax;
    })(gamy.LoaderCore);
    gamy.LoaderMax = LoaderMax;
})(gamy || (gamy = {}));
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    (function (EVENT_TYPE) {
        EVENT_TYPE[EVENT_TYPE["CLICK"] = 0] = "CLICK";
        EVENT_TYPE[EVENT_TYPE["MOVE"] = 1] = "MOVE";
        EVENT_TYPE[EVENT_TYPE["DOWN"] = 2] = "DOWN";
        EVENT_TYPE[EVENT_TYPE["UP"] = 3] = "UP";
        EVENT_TYPE[EVENT_TYPE["OVER"] = 4] = "OVER";
        EVENT_TYPE[EVENT_TYPE["OUT"] = 5] = "OUT";
    })(gamy.EVENT_TYPE || (gamy.EVENT_TYPE = {}));
    var EVENT_TYPE = gamy.EVENT_TYPE;
    (function (DeviceOrientation) {
        DeviceOrientation[DeviceOrientation["portraitPrimary"] = 0] = "portraitPrimary";
        DeviceOrientation[DeviceOrientation["portraitSecondary"] = 1] = "portraitSecondary";
        DeviceOrientation[DeviceOrientation["landscapePrimary"] = 2] = "landscapePrimary";
        DeviceOrientation[DeviceOrientation["landscapeSecondary"] = 3] = "landscapeSecondary";
    })(gamy.DeviceOrientation || (gamy.DeviceOrientation = {}));
    var DeviceOrientation = gamy.DeviceOrientation;
    (function (Browser) {
        Browser[Browser["safari"] = 0] = "safari";
        Browser[Browser["unknown"] = 1] = "unknown";
    })(gamy.Browser || (gamy.Browser = {}));
    var Browser = gamy.Browser;
    var deviceOrientation;
    function onOrientationChange() {
        if ('orientation' in window) {
            if (window.orientation == -90) {
                deviceOrientation = DeviceOrientation.landscapePrimary;
            }
            else if (window.orientation == 90) {
                deviceOrientation = DeviceOrientation.landscapeSecondary;
            }
            else if (window.orientation == 180) {
                deviceOrientation = DeviceOrientation.portraitSecondary;
            }
            else if (window.orientation == 0) {
                deviceOrientation = DeviceOrientation.portraitPrimary;
            }
        }
        else {
            var orientation = window.screen['orientation'] || window.screen['mozOrientation'] || window.screen.msOrientation;
            if (orientation && 'type' in orientation) {
                if (orientation.type === "landscape-primary") {
                    deviceOrientation = DeviceOrientation.landscapePrimary;
                }
                else if (orientation.type === "landscape-secondary") {
                    deviceOrientation = DeviceOrientation.landscapeSecondary;
                }
                else if (orientation.type === "portrait-secondary") {
                    deviceOrientation = DeviceOrientation.portraitSecondary;
                }
                else if (orientation.type === "portrait-primary") {
                    deviceOrientation = DeviceOrientation.portraitPrimary;
                }
            }
            else {
                deviceOrientation = DeviceOrientation.landscapePrimary;
            }
        }
    }
    window.addEventListener('orientationchange', onOrientationChange);
    onOrientationChange();
    (function (OperatingSystem) {
        OperatingSystem[OperatingSystem["iOS"] = 0] = "iOS";
        OperatingSystem[OperatingSystem["android"] = 1] = "android";
        OperatingSystem[OperatingSystem["unknown"] = 2] = "unknown";
    })(gamy.OperatingSystem || (gamy.OperatingSystem = {}));
    var OperatingSystem = gamy.OperatingSystem;
    var Capabilities = (function () {
        function Capabilities() {
            throw new Error('static class');
        }
        Object.defineProperty(Capabilities, "scaleFactor", {
            get: function () {
                if (window.devicePixelRatio < 2)
                    return 1;
                else if (window.devicePixelRatio < 3)
                    return 2;
                return 3;
            },
            enumerable: true,
            configurable: true
        });
        Capabilities.eventType = function (type) {
            switch (type) {
                case EVENT_TYPE.CLICK:
                    return gamy.isMobile() ? 'tap' : 'click';
                case EVENT_TYPE.MOVE:
                    return gamy.isMobile() ? 'touchmove' : 'mousemove';
                case EVENT_TYPE.DOWN:
                    return gamy.isMobile() ? 'touchstart' : 'mousedown';
                case EVENT_TYPE.UP:
                    return gamy.isMobile() ? 'touchend' : 'mouseup';
                case EVENT_TYPE.OVER:
                    return gamy.isMobile() ? 'pointerover' : 'mouseover';
                case EVENT_TYPE.OUT:
                    return gamy.isMobile() ? 'touchendoutside' : 'mouseout';
            }
            return null;
        };
        Capabilities.isPrimaryTouchPoint = function (event) {
            if (gamy.isMobile()) {
                var touches = event.data.originalEvent.touches;
                return touches.length == 0 ? true : event.data.identifier == touches[0].identifier;
            }
            return true;
        };
        Object.defineProperty(Capabilities, "orientation", {
            get: function () {
                return deviceOrientation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Capabilities, "operatingSystem", {
            get: function () {
                if (navigator.userAgent.match(/Android/i)) {
                    return OperatingSystem.android;
                }
                if (navigator.userAgent.match(/iPhone/i) ||
                    navigator.userAgent.match(/iPad/i) ||
                    navigator.userAgent.match(/iPod/i)) {
                    return OperatingSystem.iOS;
                }
                return OperatingSystem.unknown;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Capabilities, "browser", {
            get: function () {
                if (navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
                    navigator.userAgent && !navigator.userAgent.match('CriOS')) {
                    return Browser.safari;
                }
                return Browser.unknown;
            },
            enumerable: true,
            configurable: true
        });
        return Capabilities;
    })();
    gamy.Capabilities = Capabilities;
})(gamy || (gamy = {}));
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    var ArrayTools = (function () {
        function ArrayTools() {
            throw new Error('static class');
        }
        ArrayTools.has = function (collection, what) {
            return collection.indexOf(what) > -1;
        };
        ArrayTools.print = function (array) {
            var output = '';
            var length = array.length;
            for (var i = 0; i < length; i++) {
                var comma = i == length - 1 ? '' : ',';
                var element = array[i];
                if (element instanceof Array)
                    output += ArrayTools.print(element) + comma;
                else if (element.constructor.name === "Object")
                    output += new gamy.Hash(element).toString() + comma;
                else
                    output += element + comma;
            }
            return '[' + output + ']';
        };
        ArrayTools.isEmpty = function (array) {
            return array.length == 0;
        };
        ArrayTools.remove = function (array, elem) {
            return array.filter(function (item, index, arr) {
                return item != elem;
            });
        };
        ArrayTools.diff = function (array, compare) {
            var unique = [];
            var length = array.length;
            for (var i = 0; i < length; i++)
                if (!ArrayTools.has(compare, array[i]))
                    unique.push(array[i]);
            return unique;
        };
        ArrayTools.intersect = function (array1, array2) {
            var intersection = [];
            var l1 = array1.length;
            var l2 = array2.length;
            if (l1 < l2) {
                for (var i = 0; i < l1; i++)
                    if (ArrayTools.has(array2, array1[i]))
                        intersection.push(array1[i]);
            }
            else {
                for (var i = 0; i < l2; i++)
                    if (ArrayTools.has(array1, array2[i]))
                        intersection.push(array2[i]);
            }
            return intersection;
        };
        ArrayTools.htmlCollectionToArray = function (collection) {
            return [].slice.call(collection);
        };
        ArrayTools.flatten = function (array) {
            var flattened = [];
            var length = array.length;
            for (var i = 0; i < length; i++) {
                var item = array[i];
                if (item instanceof Array)
                    flattened = flattened.concat(ArrayTools.flatten(item));
                else
                    flattened.push(item);
            }
            return flattened;
        };
        return ArrayTools;
    })();
    gamy.ArrayTools = ArrayTools;
})(gamy || (gamy = {}));
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    var Aspect = (function () {
        function Aspect(width, height) {
            this._width = 0;
            this._height = 0;
            this._ratio = 0;
            this.x = 0;
            this.y = 0;
            this._width = width;
            this._height = height;
            this._ratio = width / height;
        }
        Object.defineProperty(Aspect.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (value) {
                this._height = value / this._ratio;
                this._width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Aspect.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (value) {
                this._width = value * this._ratio;
                this._height = value;
            },
            enumerable: true,
            configurable: true
        });
        Aspect.prototype.constrain = function (w, h) {
            this.x = this.y = 0;
            if ((w / h) < this._ratio) {
                this.width = w;
                this.y = (h - this._height) / 2.0;
            }
            else {
                this.height = h;
                this.x = (w - this._width) / 2.0;
            }
            return this;
        };
        Aspect.prototype.crop = function (w, h) {
            this.x = this.y = 0;
            if ((w / h) > this._ratio) {
                this.width = w;
                this.y = (h - this._height) / 2.0;
            }
            else {
                this.height = h;
                this.x = (w - this._width) / 2.0;
            }
            return this;
        };
        return Aspect;
    })();
    gamy.Aspect = Aspect;
})(gamy || (gamy = {}));
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    var hash = sha1.hash;
    var GUID = (function () {
        function GUID() {
        }
        GUID.create = function () {
            var id1 = new Date().getTime();
            var id2 = Math.random();
            GUID._counter++;
            return hash(id1 + '_' + id2 + '_' + GUID._counter);
        };
        GUID._counter = 0;
        return GUID;
    })();
    gamy.GUID = GUID;
})(gamy || (gamy = {}));
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    var Hash = (function () {
        function Hash(object) {
            if (object === void 0) { object = null; }
            if (object)
                this.merge(object);
        }
        Hash.prototype.merge = function (object, recursive) {
            if (recursive === void 0) { recursive = true; }
            if (object == undefined)
                return this;
            var keys = Object.keys(object);
            for (var _i = 0; _i < keys.length; _i++) {
                var name = keys[_i];
                if (object[name] !== null) {
                    //trace('=>', name, recursive, this.instanceIsObjOrHash(this[name]), this.instanceIsObjOrHash(object[name]), this[name], object[name])
                    if (recursive && this.instanceIsObjOrHash(this[name]) && this.instanceIsObjOrHash(object[name]))
                        this[name] = new Hash(this[name]).merge(object[name], recursive);
                    else
                        this[name] = object[name];
                }
            }
            return this;
        };
        Hash.prototype.instanceIsObjOrHash = function (instance) {
            return instance != undefined && (instance.constructor.name === 'Object' || instance.constructor.className === Hash.className);
        };
        Hash.prototype.toString = function () {
            var out = [];
            var keys = Object.keys(this);
            //trace('=>', ArrayTools.print(keys))
            for (var _i = 0; _i < keys.length; _i++) {
                var name = keys[_i];
                if (this[name] instanceof Array)
                    out.push(name + ': ' + gamy.ArrayTools.print(this[name]));
                else
                    out.push(name + ': ' + (this.instanceIsObjOrHash(this[name]) ? new Hash(this[name]).toString() : this[name]));
            }
            return '{' + out.join(', ') + '}';
        };
        Hash.prototype.isEmpty = function () {
            return Object.keys(this).length == 0;
        };
        Hash.prototype.has = function () {
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i - 0] = arguments[_i];
            }
            for (var _a = 0; _a < rest.length; _a++) {
                var needle = rest[_a];
                if (needle instanceof Array && this.has.apply(this, needle))
                    return true;
                else if (this[needle] !== undefined)
                    return true;
            }
            return false;
        };
        Object.defineProperty(Hash.prototype, "length", {
            get: function () {
                return Object.keys(this).length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Hash.prototype, "values", {
            get: function () {
                var v = [];
                var keys = Object.keys(this);
                for (var _i = 0; _i < keys.length; _i++) {
                    var name = keys[_i];
                    v.push(this[name]);
                }
                return v;
            },
            enumerable: true,
            configurable: true
        });
        Hash.prototype.diff = function (other) {
            var h = new Hash();
            var keys = Object.keys(this);
            for (var _i = 0; _i < keys.length; _i++) {
                var name = keys[_i];
                if (other[name] === undefined || other[name] != this[name])
                    h[name] = this[name];
            }
            return h;
        };
        Hash.prototype.mapValues = function (callback) {
            var h = new Hash();
            var keys = Object.keys(this);
            for (var _i = 0; _i < keys.length; _i++) {
                var name = keys[_i];
                h[name] = callback(name, this[name]);
            }
            return h;
        };
        Hash.prototype.dup = function () {
            return new Hash(this);
        };
        Hash.prototype.withoutKeys = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var keys = args[0] instanceof Array ? args[0] : args;
            var h = new Hash();
            this.forEach(function (k, v) {
                if (keys.indexOf(k) < 0)
                    h[k] = this[k];
            });
            return h;
        };
        Hash.prototype.forEach = function (check) {
            var keys = Object.keys(this);
            for (var _i = 0; _i < keys.length; _i++) {
                var name = keys[_i];
                check.call(this, name, this[name]);
            }
        };
        Hash.prototype.toObject = function () {
            var object = {};
            this.forEach(function (k, v) {
                object[k] = this[k];
            });
            return object;
        };
        Hash.className = 'gamy.Hash';
        return Hash;
    })();
    gamy.Hash = Hash;
})(gamy || (gamy = {}));
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    var NumberTools = (function () {
        function NumberTools() {
            throw new Error('static class');
        }
        NumberTools.currency = function (n) {
            if (isNaN(n))
                return '0.00';
            var m = n / 100 + '';
            var decimal = m.indexOf('.');
            if (decimal == -1)
                return m + '.00';
            if (m.length - decimal == 2)
                return m + '0';
            return m;
        };
        NumberTools.formatCurrency = function (n) {
            var currency = NumberTools.currency(n);
            var banknotes = currency.substring(0, currency.indexOf('.'));
            var coins = currency.substring(currency.indexOf('.'));
            return NumberTools.formatNumber(banknotes) + coins;
        };
        /**
         * Use this for putting spaces between digits of natural numbers.
         * @param n
         * @returns {string}
         */
        NumberTools.formatNumber = function (n) {
            var prefix = n.split('');
            var counter = 3;
            var i = prefix.length;
            while (--i > 0) {
                counter--;
                if (counter == 0) {
                    counter = 3;
                    prefix.splice(i, 0, ' ');
                }
            }
            return prefix.join('');
        };
        return NumberTools;
    })();
    gamy.NumberTools = NumberTools;
})(gamy || (gamy = {}));
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    var StringTools = (function () {
        function StringTools() {
            throw new Error('static class');
        }
        StringTools.digitalTime = function () {
            var date = new Date();
            var day = date.getDate();
            var hour = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var milliseconds = date.getMilliseconds();
            return StringTools.prefix(0, day, 2 - day.toString().length) + ' ' + StringTools.months[date.getMonth()] + ' ' + date.getFullYear() + ', ' + StringTools.prefix(0, hour, 2 - hour.toString().length) + ':' + StringTools.prefix(0, minutes, 2 - minutes.toString().length) + ':' + StringTools.prefix(0, seconds, 2 - seconds.toString().length) + ':' + StringTools.prefix(0, milliseconds, 3 - milliseconds.toString().length);
        };
        StringTools.prefix = function (what, to, amount) {
            if (to === void 0) { to = ''; }
            if (amount === void 0) { amount = 0; }
            var prefix = '';
            for (var i = 0; i < amount; i++)
                prefix += what;
            return prefix.concat(to);
        };
        StringTools.toPackageNameConvention = function (input) {
            var regex = /([A-Z]?[a-z]*)/g;
            var matches = input.match(regex);
            var length = matches.length;
            var result = '';
            for (var i = 0; i < length; i++) {
                if (matches[i] != '')
                    result += (i > 0 ? '_' : '') + matches[i].toLowerCase();
            }
            return result;
        };
        StringTools.renderTemplate = function (src, values) {
            values = values || {};
            return src.replace(/\(\([A-Za-z0-9]+\)\)/g, function () {
                var anchor = arguments[0];
                var param = anchor.substr(2, anchor.length - 4);
                return values[param];
            });
        };
        StringTools.months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        return StringTools;
    })();
    gamy.StringTools = StringTools;
})(gamy || (gamy = {}));
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
var gamy;
(function (gamy) {
    var Circ = (function () {
        function Circ() {
        }
        Circ.easeIn = function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        };
        Circ.easeOut = function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        };
        Circ.easeInOut = function (t, b, c, d) {
            if ((t /= d * 0.5) < 1)
                return -c * 0.5 * (Math.sqrt(1 - t * t) - 1) + b;
            return c * 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        };
        return Circ;
    })();
    gamy.Circ = Circ;
})(gamy || (gamy = {}));
//# sourceMappingURL=gamy.debug.js.map