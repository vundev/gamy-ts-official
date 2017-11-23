/**
 * Created by Atanas Vasilev at avant.vasilev@gmail.com.
 */
module gamy {
    export class Aspect {
        private _width: number = 0
        private _height: number = 0
        private _ratio: number = 0
        public x: number = 0
        public y: number = 0

        constructor(width: number, height: number) {
            this._width = width
            this._height = height

            this._ratio = width / height
        }

        public get width(): number {
            return this._width
        }

        public set width(value: number) {
            this._height = value / this._ratio
            this._width = value
        }

        public get height(): number {
            return this._height
        }

        public set height(value: number) {
            this._width = value * this._ratio
            this._height = value
        }

        public constrain(w: number, h: number): Aspect {
            this.x = this.y = 0
            if ((w / h) < this._ratio) {
                this.width = w
                this.y = (h - this._height) / 2.0
            }
            else {
                this.height = h
                this.x = (w - this._width) / 2.0
            }
            return this
        }

        public crop(w: number, h: number): Aspect {
            this.x = this.y = 0
            if ((w / h) > this._ratio) {
                this.width = w
                this.y = (h - this._height) / 2.0
            }
            else {
                this.height = h
                this.x = (w - this._width) / 2.0
            }
            return this
        }
    }
}