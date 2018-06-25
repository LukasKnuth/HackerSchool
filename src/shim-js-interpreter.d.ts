declare module "js-interpreter" {

    type API = (interpreter: Interpreter, scope: InterpreterScope) => void;
    type NativeWrapper = (...params: any[]) => void;
    type InterpreterScope = any;

    export default class Interpreter {
        constructor(code: string, api?: API);
        public setProperty(scope: InterpreterScope, name: string, wrapper: NativeWrapper): void;
        public createNativeFunction(toWrap: Function): NativeWrapper;
        /**
         * @returns {boolean} True if executed, false if no more instructions!
         */
        public step(): boolean;
        public run(): void;
    }
}
