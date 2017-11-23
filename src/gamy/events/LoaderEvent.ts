/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
namespace gamy {
    export class LoaderEvent {
        public static COMPLETE: string = 'complete'
        public static FAIL: string = 'fail'
        public static CHILD_COMPLETE: string = 'childComplete'
        public static CHILD_FAIL: string = 'childFail'
        public static CHILD_OPEN: string = 'childOpen'
        public static UNLOAD: string = 'unload'
        public static OPEN: string = 'open'

        public type: string
        public target: any

        constructor(type: string, target: any = null) {
            this.type = type
            this.target = target
        }
    }
}