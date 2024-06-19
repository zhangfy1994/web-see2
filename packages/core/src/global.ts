/* eslint-disable @typescript-eslint/no-explicit-any */
import { UAParser } from 'ua-parser-js';
type Flags = { [key: string]: boolean };
type WebSee = { flags: Flags; [key: string]: any };
type Global = Window & { __websee__: WebSee };

function getGlobal(): Global {
  return window as unknown as Global;
}
function getGlobalSupport(): WebSee {
  _global.__websee__ = _global.__websee__ || {};
  return _global.__websee__;
}

const _global = getGlobal();
const _support = getGlobalSupport();

//设备信息
const uaResult = new UAParser().getResult();
_support.deviceInfo = {
  browserVersion: uaResult.browser.version, // // 浏览器版本号 107.0.0.0
  browser: uaResult.browser.name, // 浏览器类型 Chrome
  osVersion: uaResult.os.version, // 操作系统 电脑系统 10
  os: uaResult.os.name, // Windows
  ua: uaResult.ua,
  device: uaResult.device.model ? uaResult.device.model : 'Unknown',
  device_type: uaResult.device.type ? uaResult.device.type : 'PC',
};

_support.hasError = false;

// errorMap 存储代码错误的集合
_support.errorMap = new Map();

// 默认配置
_support.flags = _support.flags || ({} as Flags);
export function setFlag(type: string, value: boolean) {
  _support.flags[type] = value;
}
export function getFlag(type: string) {
  return _support.flags[type];
}

// 是否存在error has
export function hasExitHash(hash: string) {
  const exit = _support.errorMap.has(hash);
  if (!exit) {
    _support.errorMap.set(hash, true);
  }
  return exit;
}

export { _global, _support };
