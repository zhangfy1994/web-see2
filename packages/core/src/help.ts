import { HttpData } from '@websee2/types';
import { globalOptions } from './options';
import { STATUS_CODE } from '@websee2/common';

// 过滤不上报接口
export function isFilterHttpReq(url: string) {
  if (globalOptions.filterXhrUrlRegExp && url) {
    return globalOptions.filterXhrUrlRegExp.test(url);
  }
  return false;
}

// 处理接口数据
export function handleHttpData(data: HttpData) {
  let message: any = '';
  let statusType: STATUS_CODE;
  const {
    status,
    response,
    elapsedTime,
    statusText,
    time,
    requestData,
    method,
    type,
  } = data;
  if (status === 0) {
    statusType = STATUS_CODE.ERROR;
    message =
      elapsedTime > globalOptions.timeout
        ? '请求超时'
        : `请求未响应，status: ${status}`;
  } else if ((status as number) < 400) {
    statusType = STATUS_CODE.OK;
    if (typeof globalOptions.handleHttpStatus === 'function') {
      if (globalOptions.handleHttpStatus(data)) {
        statusType = STATUS_CODE.OK;
      } else {
        statusType = STATUS_CODE.ERROR;
        message = `接口异常，status: ${status}; ${typeof response === 'string' ? response : JSON.stringify(response)}`;
      }
    }
  } else {
    statusType = STATUS_CODE.ERROR;
    message = statusText;
  }

  message = `url: ${data.url}; status: ${status}; ${message}`;
  return {
    statusType,
    message,
    status,
    time,
    elapsedTime,
    url: data.url,
    requestData: {
      httpType: type as string,
      method,
      data: requestData || '',
    },
    response: {
      status,
      data: statusType == STATUS_CODE.ERROR ? response : null,
    },
  };
}
