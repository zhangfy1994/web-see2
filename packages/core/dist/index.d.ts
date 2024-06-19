import { InitOptions } from '@websee2/types';

declare function init(options: InitOptions): void;
declare function install(Vue: {
    [key: string]: any;
}, options: InitOptions): void;
declare const _default: {
    init: typeof init;
    install: typeof install;
};

export { _default as default };
