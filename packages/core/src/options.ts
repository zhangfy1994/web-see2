/* eslint-disable @typescript-eslint/no-explicit-any */
import { EVENTTYPES } from '@websee2/common';
import { InitOptions } from '@websee2/types';
import { _support, setFlag } from './global';
import { bindOptionsHelp } from '@websee2/utils';

class Options {
  dsn = ''; // 监控上报接口的地址
  throttleDelayTime = 0; // click事件的节流时长
  overTime = 10; // 接口超时时长
  whiteBoxElements: string[] = ['html', 'body', '#app', '#root']; // // 白屏检测的容器列表
  silentWhiteScreen = false; // 是否开启白屏检测
  skeletonProject = false; // 项目是否有骨架屏
  filterXhrUrlRegExp: any; // 过滤的接口请求正则
  handleHttpStatus: any; // 处理接口返回的 response
  repeatCodeError = false; // 是否去除重复的代码错误，重复的错误只上报一次

  bindOptions(options: InitOptions) {
    const {
      dsn,
      filterXhrUrlRegExp,
      throttleDelayTime = 0,
      overTime = 10,
      silentWhiteScreen = false,
      whiteBoxElements = ['html', 'body', '#app', '#root'],
      skeletonProject = false,
      handleHttpStatus,
      repeatCodeError = false,
    } = options;

    bindOptionsHelp(this, 'dsn', dsn, 'string');
    bindOptionsHelp(this, 'filterXhrUrlRegExp', filterXhrUrlRegExp, 'regexp');
    bindOptionsHelp(this, 'throttleDelayTime', throttleDelayTime, 'number');
    bindOptionsHelp(this, 'overTime', overTime, 'number');
    bindOptionsHelp(this, 'whiteBoxElements', whiteBoxElements, 'array');
    bindOptionsHelp(this, 'silentWhiteScreen', silentWhiteScreen, 'boolean');
    bindOptionsHelp(this, 'skeletonProject', skeletonProject, 'boolean');
    bindOptionsHelp(this, 'handleHttpStatus', handleHttpStatus, 'function');
    bindOptionsHelp(this, 'repeatCodeError', repeatCodeError, 'boolean');
  }
}
const globalOptions = _support.options || (_support.options = new Options());

function setGlobalOptions(options: InitOptions) {
  setSilentFlag(options);
}

export function setSilentFlag({
  silentXhr = true,
  silentFetch = true,
  silentClick = true,
  silentHistory = true,
  silentError = true,
  silentHashchange = true,
  silentUnhandledrejection = true,
  silentWhiteScreen = false,
}): void {
  setFlag(EVENTTYPES.XHR, silentXhr);
  setFlag(EVENTTYPES.FETCH, silentFetch);
  setFlag(EVENTTYPES.CLICK, silentClick);
  setFlag(EVENTTYPES.HISTORY, silentHistory);
  setFlag(EVENTTYPES.ERROR, silentError);
  setFlag(EVENTTYPES.HASHCHANGE, silentHashchange);
  setFlag(EVENTTYPES.UNHANDLEDREJECTION, silentUnhandledrejection);
  setFlag(EVENTTYPES.WHITESCREEN, silentWhiteScreen);
}

export { setGlobalOptions, globalOptions };
