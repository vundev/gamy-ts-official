/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
module gamy {
    export class StringTools {

        private static months: Array<string> = [
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
        ]

        constructor() {
            throw new Error('static class')
        }

        public static digitalTime(): string {
            const date: Date = new Date()
            const day: number = date.getDate();
            const hour: number = date.getHours();
            const minutes: number = date.getMinutes();
            const seconds: number = date.getSeconds();
            const milliseconds: number = date.getMilliseconds();
            return StringTools.prefix(0, day, 2 - day.toString().length) + ' ' + StringTools.months[date.getMonth()] + ' ' + date.getFullYear() + ', ' + StringTools.prefix(0, hour, 2 - hour.toString().length) + ':' + StringTools.prefix(0, minutes, 2 - minutes.toString().length) + ':' + StringTools.prefix(0, seconds, 2 - seconds.toString().length) + ':' + StringTools.prefix(0, milliseconds, 3 - milliseconds.toString().length);
        }

        public static prefix(what: any, to: any = '', amount: number = 0): string {
            var prefix: String = '';
            for (var i: number = 0; i < amount; i++)
                prefix += what;
            return prefix.concat(to);
        }

        public static toPackageNameConvention(input: string): string {
            const regex: RegExp = /([A-Z]?[a-z]*)/g;
            const matches: Array<any> = input.match(regex)
            const length: number = matches.length
            var result: string = '';
            for (var i: number = 0; i < length; i++) {
                if (matches[i] != '')
                    result += (i > 0 ? '_' : '') + matches[i].toLowerCase();
            }
            return result
        }

        public static renderTemplate(src: string, values?: any): string {
            values = values || {};
            return src.replace(/\(\([A-Za-z0-9]+\)\)/g, function (): string {
                const anchor: string = arguments[0]
                const param: string = anchor.substr(2, anchor.length - 4);
                return values[param];
            })
        }
    }
}