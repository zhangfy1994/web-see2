import { Callback, IAnyObject } from '@websee2/types';
import { v4 } from 'uuid';

/* eslint-disable @typescript-eslint/no-explicit-any */
// 获取当前的时间戳
export function getTimestamp(): number {
  return Date.now();
}

// 判断类型
export function typeofAny(target: any): string {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

// 设置属性
export function bindOptionsHelp(
  target: any,
  key: string,
  value: any,
  type: string,
) {
  if (!target) return false;
  if (typeofAny(value) === type) {
    target[key] = value;
    return true;
  }
  return false;
}

// 生成uuid
export function generateUUID(): string {
  return v4();
}

//replaceAop
export function replaceAop(
  target: IAnyObject,
  property: string,
  replaceCb: Callback,
) {
  if (!(property in target)) return;
  const originFn = target[property];
  const wrap = replaceCb(originFn);
  if (typeof wrap === 'function') {
    target[property] = wrap;
  }
}

// 事件监听
export function on(
  target: any,
  event: string,
  handle: Callback,
  options = false,
) {
  target.addEventListener(event, handle, options);
}

// 对每一个错误详情，生成唯一的编码
export function getErrorUid(input: string): string {
  return window.btoa(encodeURIComponent(input));
}

export * from './queue';
