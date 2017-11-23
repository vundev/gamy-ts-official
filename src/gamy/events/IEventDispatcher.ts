/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
module gamy {
    export interface IEventDispatcher {
        addEventListener(type: string, callback: Function, context?: any): void
        dispatchEvent(event: any): void
        removeEventListener(type: string, callback: Function): void
        hasEventListener(type: string): boolean
    }
}
