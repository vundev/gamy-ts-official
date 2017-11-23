/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare var DEBUG: boolean;
declare var VERSION: string;
declare module gamy {
    const version: string;
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare module gamy {
    enum LogLevels {
        VERBOSE = 0,
        NO_LOG = 1,
    }
    class LogOptions {
        static DEFAULT_LOG: LogOptions;
        private _name;
        private _options;
        constructor(name: string, options?: any);
        name: string;
        options: any;
    }
}
declare module gamy {
    class EventDispatcher implements IEventDispatcher {
        private _listenerMap;
        private _target;
        constructor(target?: any);
        addEventListener(type: string, callback: Function, context?: any): void;
        hasEventListener(type: string): boolean;
        private hasEventListenerForSpecificContext(type, context, callback);
        dispatchEvent(event: any): void;
        removeEventListener(type: string, callback: Function, context?: any): void;
    }
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare module gamy {
    interface IEventDispatcher {
        addEventListener(type: string, callback: Function, context?: any): void;
        dispatchEvent(event: any): void;
        removeEventListener(type: string, callback: Function): void;
        hasEventListener(type: string): boolean;
    }
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare namespace gamy {
    class LoaderEvent {
        static COMPLETE: string;
        static FAIL: string;
        static CHILD_COMPLETE: string;
        static CHILD_FAIL: string;
        static CHILD_OPEN: string;
        static UNLOAD: string;
        static OPEN: string;
        type: string;
        target: any;
        constructor(type: string, target?: any);
    }
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare module gamy {
    enum LoaderStatus {
        READY = 0,
        LOADING = 1,
        COMPLETED = 2,
        FAILED = 3,
    }
    class LoaderCore extends EventDispatcher {
        name: string;
        vars: any;
        protected static _loaderCount: number;
        protected static _globalRootLoader: LoaderMax;
        protected _content: any;
        protected _status: number;
        constructor(vars?: any);
        load(): void;
        protected _load(): void;
        unload(): void;
        protected completeHandler(event?: any): void;
        protected errorHandler(event?: any): void;
        toString(): string;
        status: number;
        content: any;
    }
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare module gamy {
    class LoaderItem extends LoaderCore {
        protected static _cacheID: number;
        url: string;
        constructor(url: string, vars?: any);
        private getQueryString(query);
        completeURL: string;
        query: string;
        toString(): string;
    }
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare module gamy {
    const NAMESPACE: string;
    function getDefinitionByName(name: string): any;
    function trace(...rest: any[]): void;
    function log(useConsoleLogOrTrace: boolean, ...rest: any[]): void;
    function setCondition(time: number): string;
    function checkCondition(id: string): boolean;
    function clearCondition(id: string): void;
    function isMobile(): boolean;
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare module gamy {
    class GameLoader extends LoaderItem {
        protected _documentClassName: string;
        protected _script: HTMLScriptElement;
        protected _scriptID: string;
        constructor(url: string, vars?: any);
        private createScriptElemnt();
        protected _load(): void;
        unload(): void;
    }
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare module gamy {
    class JSONLoader extends LoaderItem {
        constructor(url: string, vars?: any);
        protected _load(): void;
        private parseLoaders(config, to?);
    }
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare module gamy {
    class LoaderMax extends LoaderCore {
        private _loaders;
        private _completeLoadersCount;
        protected _prependURLs: string;
        constructor(vars?: any);
        protected _load(): void;
        protected completeChildHandler(event: LoaderEvent): void;
        protected errorChildHandler(event: LoaderEvent): void;
        protected unloadChildHandler(event: LoaderEvent): void;
        protected openChildHandler(event: LoaderEvent): void;
        append(loader: LoaderCore): LoaderCore;
        getLoader(nameOrURL: string): any;
        getContent(nameOrURL: string): any;
        static getContent(nameOrURL: string): any;
        static getLoader(nameOrURL: string): any;
        static print(): void;
        content: any;
        numChildren: number;
        status: number;
    }
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare module gamy {
    enum EVENT_TYPE {
        CLICK = 0,
        MOVE = 1,
        DOWN = 2,
        UP = 3,
        OVER = 4,
        OUT = 5,
    }
    enum DeviceOrientation {
        portraitPrimary = 0,
        portraitSecondary = 1,
        landscapePrimary = 2,
        landscapeSecondary = 3,
    }
    enum Browser {
        safari = 0,
        unknown = 1,
    }
    enum OperatingSystem {
        iOS = 0,
        android = 1,
        unknown = 2,
    }
    class Capabilities {
        constructor();
        static scaleFactor: number;
        static eventType(type: number): string;
        static isPrimaryTouchPoint(event: any): boolean;
        static orientation: DeviceOrientation;
        static operatingSystem: OperatingSystem;
        static browser: Browser;
    }
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare module gamy {
    class ArrayTools {
        constructor();
        static has(collection: any, what: any): boolean;
        static print(array: Array<any>): string;
        static isEmpty(array: Array<any>): boolean;
        static remove(array: Array<any>, elem: any): Array<any>;
        static diff(array: Array<any>, compare: Array<any>): Array<any>;
        static intersect(array1: Array<any>, array2: Array<any>): Array<any>;
        static htmlCollectionToArray(collection: HTMLCollection): Array<any>;
        static flatten(array: Array<any>): Array<any>;
    }
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare module gamy {
    class Aspect {
        private _width;
        private _height;
        private _ratio;
        x: number;
        y: number;
        constructor(width: number, height: number);
        width: number;
        height: number;
        constrain(w: number, h: number): Aspect;
        crop(w: number, h: number): Aspect;
    }
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare namespace gamy {
    class GUID {
        private static _counter;
        static create(): string;
    }
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare module gamy {
    class Hash {
        static className: string;
        constructor(object?: Object);
        merge(object: Object, recursive?: boolean): Hash;
        private instanceIsObjOrHash(instance);
        toString(): string;
        isEmpty(): boolean;
        has(...rest: any[]): boolean;
        length: number;
        values: Array<any>;
        diff(other: any): Hash;
        mapValues(callback: (k?: any, v?: any) => any): Hash;
        dup(): Hash;
        withoutKeys(...args: any[]): Hash;
        forEach(check: (k: any, v: any) => void): void;
        toObject(): Object;
    }
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare module gamy {
    class NumberTools {
        constructor();
        static currency(n: number): string;
        static formatCurrency(n: number): string;
        /**
         * Use this for putting spaces between digits of natural numbers.
         * @param n
         * @returns {string}
         */
        static formatNumber(n: string): string;
    }
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare module gamy {
    class StringTools {
        private static months;
        constructor();
        static digitalTime(): string;
        static prefix(what: any, to?: any, amount?: number): string;
        static toPackageNameConvention(input: string): string;
        static renderTemplate(src: string, values?: any): string;
    }
}
/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
declare module gamy {
    class Circ {
        static easeIn(t: number, b: number, c: number, d: number): number;
        static easeOut(t: number, b: number, c: number, d: number): number;
        static easeInOut(t: number, b: number, c: number, d: number): number;
    }
}
