/* eslint-disable @typescript-eslint/no-explicit-any */
import { InitOptions } from '@websee2/types';
import { _global, getFlag, setFlag } from './global';
import { globalOptions, setGlobalOptions } from './options';
import { breadcrumb } from './breadcrumb';
import { transportData } from './reportData';
import { setupReplace } from './setupReplace';
import { EVENTTYPES } from '@websee2/common';
import { HandleEvents } from './handleEvents';

function init(options: InitOptions) {
  if (!options.dsn || !options.apikey) {
    return console.error('options.dsn or options.apikey is required');
  }
  if (!('fetch' in _global) || options.disabled) return;

  // 全局标识
  setGlobalOptions(options);
  // 用户行为
  breadcrumb.bindOptions(options);
  // transportData 配置上报的信息
  transportData.bindOptions(options);
  // 其他配置
  globalOptions.bindOptions(options);
  // 重写浏览器原生事件并注册回调
  setupReplace();
}

// vue 使用
function install(Vue: { [key: string]: any }, options: InitOptions) {
  if (getFlag(EVENTTYPES.VUE)) return;
  setFlag(EVENTTYPES.VUE, true);
  const errorHandle = Vue.config.errorHandler;
  Vue.config.errorHandler = function (err: Error, vm: any, info: string) {
    HandleEvents.handleError(err);
    errorHandle?.apply(null, [err, vm, info]);
  };
  init(options);
}

// react errorhandler
function errorBundle(err: Error) {
  HandleEvents.handleError(err);
}

// 插件use
function use(plugin: any, options: any) {
  try {
    const instance = new plugin(options);
    instance.core({ transportData });
  } catch (error) {}
}

export default {
  init,
  install,
  errorBundle,
  use,
};
