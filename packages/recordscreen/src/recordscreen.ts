import { generateUUID, getTimestamp } from '@websee2/utils';
import pako from 'pako';
import { Base64 } from 'js-base64';
import { _support } from '../../core/src/global';
import { record } from 'rrweb';
import { EVENTTYPES, STATUS_CODE } from '@websee2/common';

export function recordScreen(transportData: any, time: number) {
  let events: any[] = [];
  record({
    emit(event, isCheckout) {
      if (isCheckout) {
        if (_support.hasError) {
          const recordScreenId = _support.recordScreenId;
          _support.recordScreenId = generateUUID();
          transportData.send({
            type: EVENTTYPES.RECORDSCREEN,
            recordScreenId,
            time: getTimestamp(),
            status: STATUS_CODE.OK,
            events: zip(events),
          });
          events = [];
          _support.hasError = false;
        } else {
          events = [];
          _support.recordScreenId = generateUUID();
        }
      }
      events.push(event);
    },
    recordCanvas: true,
    checkoutEveryNms: 1000 * time,
  });
}
// 压缩
export function zip(data: any): string {
  if (!data) return data;
  // 判断数据是否需要转为JSON
  const dataJson =
    typeof data !== 'string' && typeof data !== 'number'
      ? JSON.stringify(data)
      : data;
  // 使用Base64.encode处理字符编码，兼容中文
  const str = Base64.encode(dataJson as string);
  const binaryString = pako.gzip(str);
  const arr = Array.from(binaryString);
  let s = '';
  arr.forEach((item: any) => {
    s += String.fromCharCode(item);
  });
  return Base64.btoa(s);
}
