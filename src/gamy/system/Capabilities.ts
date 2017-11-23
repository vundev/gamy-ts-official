/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
module gamy {
    export enum EVENT_TYPE {
        CLICK,
        MOVE,
        DOWN,
        UP,
        OVER,
        OUT
    }

    export enum DeviceOrientation {
        portraitPrimary,
        portraitSecondary,
        landscapePrimary,
        landscapeSecondary
    }

    export enum Browser {
        safari,
        unknown
    }

    var deviceOrientation: DeviceOrientation

    function onOrientationChange() {
        if ('orientation' in window) {
            if (window.orientation == -90) {
                deviceOrientation = DeviceOrientation.landscapePrimary
            } else if (window.orientation == 90) {
                deviceOrientation = DeviceOrientation.landscapeSecondary
            } else if (window.orientation == 180) {
                deviceOrientation = DeviceOrientation.portraitSecondary
            } else if (window.orientation == 0) {
                deviceOrientation = DeviceOrientation.portraitPrimary
            }
        } else {
            var orientation = window.screen['orientation'] || window.screen['mozOrientation'] || window.screen.msOrientation;
            if (orientation && 'type' in orientation) {
                if (orientation.type === "landscape-primary") {
                    deviceOrientation = DeviceOrientation.landscapePrimary
                } else if (orientation.type === "landscape-secondary") {
                    deviceOrientation = DeviceOrientation.landscapeSecondary
                } else if (orientation.type === "portrait-secondary") {
                    deviceOrientation = DeviceOrientation.portraitSecondary
                } else if (orientation.type === "portrait-primary") {
                    deviceOrientation = DeviceOrientation.portraitPrimary
                }
            } else {
                deviceOrientation = DeviceOrientation.landscapePrimary
            }
        }
    }

    window.addEventListener('orientationchange', onOrientationChange)
    onOrientationChange()

    export enum OperatingSystem {
        iOS,
        android,
        unknown
    }

    export class Capabilities {
        constructor() {
            throw new Error('static class')
        }

        public static get scaleFactor(): number {
            if (window.devicePixelRatio < 2) return 1
            else if (window.devicePixelRatio < 3) return 2
            return 3
        }

        public static eventType(type: number): string {
            switch (type) {
                case EVENT_TYPE.CLICK:
                    return isMobile() ? 'tap' : 'click'
                case EVENT_TYPE.MOVE:
                    return isMobile() ? 'touchmove' : 'mousemove'
                case EVENT_TYPE.DOWN:
                    return isMobile() ? 'touchstart' : 'mousedown'
                case EVENT_TYPE.UP:
                    return isMobile() ? 'touchend' : 'mouseup'
                case EVENT_TYPE.OVER:
                    return isMobile() ? 'pointerover' : 'mouseover'
                case EVENT_TYPE.OUT:
                    return isMobile() ? 'touchendoutside' : 'mouseout'
            }
            return null
        }

        public static isPrimaryTouchPoint(event): boolean {
            if (isMobile()) {
                const touches: Array<any> = event.data.originalEvent.touches
                return touches.length == 0 ? true : event.data.identifier == touches[0].identifier
            }
            return true
        }

        public static get orientation(): DeviceOrientation {
            return deviceOrientation
        }

        public static get operatingSystem(): OperatingSystem {
            if (navigator.userAgent.match(/Android/i)) {
                return OperatingSystem.android
            }
            if (navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/iPod/i)) {
                return OperatingSystem.iOS
            }
            return OperatingSystem.unknown
        }

        public static get browser(): Browser {
            if (navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
                navigator.userAgent && !navigator.userAgent.match('CriOS')) {
                return Browser.safari
            }

            return Browser.unknown
        }
    }
}