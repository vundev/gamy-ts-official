/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
namespace gamy {
    import hash = sha1.hash;
    export class GUID {
        private static _counter: number = 0

        public static create(): string {
            const id1: number = new Date().getTime()
            const id2: number = Math.random()
            GUID._counter++;
            return hash(id1 + '_' + id2 + '_' + GUID._counter);
        }
    }
}