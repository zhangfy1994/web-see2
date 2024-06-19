/* eslint-disable @typescript-eslint/no-explicit-any */
import { EVENTTYPES } from '@websee2/common';
import { ReplaceCallback, ReplaceHandler } from '@websee2/types';

const EVENT_MAP: { [key in EVENTTYPES]?: ReplaceCallback[] } = {};
export function subscribe(handler: ReplaceHandler) {
  if (!handler) return false;
  if (Array.isArray(EVENT_MAP[handler.type])) {
    EVENT_MAP[handler.type]?.push(handler.callback);
  } else {
    EVENT_MAP[handler.type] = [handler.callback];
  }
  return true;
}

export function notify(type: EVENTTYPES, data?: any) {
  if (Array.isArray(EVENT_MAP[type]) && EVENT_MAP[type]?.length) {
    EVENT_MAP[type]?.forEach((f) => f(data));
  }
}
