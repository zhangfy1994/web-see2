import { VoidFn, IAnyObject, Callback } from '@websee2/types';

declare class Queue {
    private stack;
    private isFlushing;
    addFn(fn: VoidFn): void;
    flush(): void;
    clear(): void;
}

declare function getTimestamp(): number;
declare function typeofAny(target: any): string;
declare function bindOptionsHelp(target: any, key: string, value: any, type: string): boolean;
declare function generateUUID(): string;
declare function replaceAop(target: IAnyObject, property: string, replaceCb: Callback): void;
declare function on(target: any, event: string, handle: Callback, options?: boolean): void;
declare function getErrorUid(input: string): string;

export { Queue, bindOptionsHelp, generateUUID, getErrorUid, getTimestamp, on, replaceAop, typeofAny };
