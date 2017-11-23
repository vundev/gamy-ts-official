/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
module gamy {
    export class NumberTools {
        constructor() {
            throw new Error('static class')
        }

        public static currency(n: number): string {
            if (isNaN(n)) return '0.00'
            const m: string = n / 100 + ''
            const decimal: number = m.indexOf('.')
            if (decimal == -1) return m + '.00'
            if (m.length - decimal == 2) return m + '0';
            return m
        }

        public static formatCurrency(n: number): string {
            const currency: string = NumberTools.currency(n)
            const banknotes: string = currency.substring(0, currency.indexOf('.'))
            const coins: string = currency.substring(currency.indexOf('.'))
            return NumberTools.formatNumber(banknotes) + coins
        }

        /**
         * Use this for putting spaces between digits of natural numbers.
         * @param n
         * @returns {string}
         */
        public static formatNumber(n: string): string {
            const prefix: Array<string> = n.split('')
            var counter: number = 3;
            var i: number = prefix.length;
            while (--i > 0) {
                counter--
                if (counter == 0) {
                    counter = 3
                    prefix.splice(i, 0, ' ')
                }
            }
            return prefix.join('')
        }
    }
}