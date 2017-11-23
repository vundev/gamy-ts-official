/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */

module gamy {
    export const NAMESPACE: string = 'gamy'

    export function getDefinitionByName(name: string): any {
        const package: string[] = name.split('.')
        try {
            var constr: any = window
            const length: number = package.length
            for (var i = 0; i < length; i++)
                constr = constr[package[i]]
            return constr
        } catch (error) {
            return null
        }
    }

    export function trace(...rest: any[]): void {
        if (DEBUG) {
            var diffFromDefault: boolean = false
            if (rest[0] instanceof LogOptions) {
                diffFromDefault = true
                var options: LogOptions = rest[0] as LogOptions
                if (options.options.level == LogLevels.NO_LOG) return
                else if (options.options.level == LogLevels.VERBOSE) rest[0] = options.name
            } else if (LogOptions.DEFAULT_LOG != null) {
                options = LogOptions.DEFAULT_LOG
                if (options.options.level == LogLevels.NO_LOG) return
            }

            const result: any[] = []
            const length: number = rest.length
            for (var i = 0; i < length; i++) {
                let toStringCondition: boolean
                try {
                    toStringCondition = rest[i].toString instanceof Function
                } catch (error) {
                    toStringCondition = false
                }
                result[i] = (toStringCondition ? rest[i].toString() : rest[i])
            }

            if (!diffFromDefault && LogOptions.DEFAULT_LOG != null)
                result.unshift(LogOptions.DEFAULT_LOG.name)

            console.log('=== ' + StringTools.digitalTime() + ' ===') // If you skip this string you will triger an issue with the console causing unexpected print output
            console.log.apply(console, result)
        }
    }

    export function log(useConsoleLogOrTrace: boolean, ...rest: any[]): void {
        if (useConsoleLogOrTrace) {
            if (DEBUG) {
                console.log.apply(console, rest)
            }
        }
        else {
            trace.apply(null, rest)
        }
    }

    var conditionMap: any = {}

    class ConditionMapItem {
        public ts: number
        public time: number

        constructor(ts: number, time: number) {
            this.ts = ts
            this.time = time
        }
    }

    export function setCondition(time: number): string {
        const id: string = GUID.create()
        conditionMap[id] = new ConditionMapItem(0, time)
        return id
    }

    export function checkCondition(id: string): boolean {
        const data: ConditionMapItem = conditionMap[id] as ConditionMapItem
        const newts: number = new Date().getTime()
        const oldts: number = data.ts
        data.ts = newts
        return newts - oldts < data.time
    }

    export function clearCondition(id: string): void {
        delete conditionMap[id]
    }

    export function isMobile(): boolean {
        if (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        } else {
            return false;
        }
    }
}