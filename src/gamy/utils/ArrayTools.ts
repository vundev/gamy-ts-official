/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
module gamy {
    export class ArrayTools {
        constructor() {
            throw new Error('static class')
        }

        public static has(collection: any, what: any): boolean {
            return collection.indexOf(what) > -1
        }

        public static print(array: Array<any>): string {
            var output: string = '';
            const length: number = array.length
            for (var i: number = 0; i < length; i++) {
                var comma: string = i == length - 1 ? '' : ',';
                var element: any = array[i]
                if (element instanceof Array) output += ArrayTools.print(element) + comma
                else if (element.constructor.name === "Object")
                    output += new Hash(element).toString() + comma;
                else output += element + comma
            }
            return '[' + output + ']';
        }

        public static isEmpty(array: Array<any>): boolean {
            return array.length == 0
        }

        public static remove(array: Array<any>, elem: any): Array<any> {
            return array.filter(function (item: any, index: number, arr: Array<any>): boolean {
                return item != elem
            })
        }

        public static diff(array: Array<any>, compare: Array<any>): Array<any> {
            const unique: Array<any> = []
            const length: number = array.length
            for (var i: number = 0; i < length; i++)
                if (!ArrayTools.has(compare, array[i])) unique.push(array[i])
            return unique
        }

        public static intersect(array1: Array<any>, array2: Array<any>): Array<any> {
            const intersection: Array<any> = []
            const l1: number = array1.length
            const l2: number = array2.length
            if (l1 < l2) {
                for (let i: number = 0; i < l1; i++)
                    if (ArrayTools.has(array2, array1[i])) intersection.push(array1[i])
            } else {
                for (let i: number = 0; i < l2; i++)
                    if (ArrayTools.has(array1, array2[i])) intersection.push(array2[i])
            }
            return intersection
        }

        public static htmlCollectionToArray(collection: HTMLCollection): Array<any> {
            return [].slice.call(collection);
        }

        public static flatten(array: Array<any>): Array<any> {
            var flattened: Array<any> = []
            const length: number = array.length
            for (var i = 0; i < length; i++) {
                let item = array[i]
                if (item instanceof Array)
                    flattened = flattened.concat(ArrayTools.flatten(item))
                else flattened.push(item)
            }
            return flattened
        }
    }
}