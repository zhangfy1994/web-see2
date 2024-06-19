/* eslint-disable @typescript-eslint/no-explicit-any */
import { EVENTTYPES } from '@websee2/common';
import { ReplaceHandler, VoidFn } from '@websee2/types';
import { getTimestamp, on, replaceAop } from '@websee2/utils';
import { isFilterHttpReq } from './help';
import { notify } from './subscribe';
import { _global } from './global';

export function replace(handler: ReplaceHandler) {
  switch (handler.type) {
    case EVENTTYPES.XHR:
      replaceXHR();
      break;

    case EVENTTYPES.FETCH:
      replaceFetch();
      break;

    case EVENTTYPES.ERROR:
      listenError();
      break;

    case EVENTTYPES.HISTORY:
      historyHandle();
      break;

    case EVENTTYPES.HASHCHANGE:
      hashHandle();
      break;

    case EVENTTYPES.UNHANDLEDREJECTION:
      handlerejection();
      break;

    default:
      break;
  }
}

function replaceXHR() {
  if (!('XMLHttpRequest' in window)) return;
  const XMLOriginProto = XMLHttpRequest.prototype;
  // replace open
  replaceAop(XMLOriginProto, 'open', function (originOpen: VoidFn) {
    return function (this: any, ...args: any[]) {
      this.websee_xhr = {
        method: typeof args[0] === 'string' ? args[0].toUpperCase() : args[0],
        url: args[1],
        sTime: getTimestamp(),
        type: EVENTTYPES.XHR,
      };
      originOpen.apply(this, args);
    };
  });
  // replace send
  replaceAop(XMLOriginProto, 'send', function (originSend: VoidFn) {
    return function (this: any, ...args: any[]) {
      const { url } = this.websee_xhr;
      on(this, 'loadend', () => {
        if (isFilterHttpReq(url)) return;
        const { response, status, responseType, statusText } = this;
        this.websee_xhr.requestData = args[0];
        const eTime = getTimestamp();
        // 接口执行时间
        this.websee_xhr.elapsedTime = eTime - this.websee_xhr.sTime;
        this.websee_xhr.status = status;
        this.websee_xhr.statusText = statusText;
        if (['', 'json', 'text'].includes(responseType)) {
          this.websee_xhr.response = response;
        }
        notify(EVENTTYPES.XHR, this.websee_xhr);
      });

      originSend.apply(this, args);
    };
  });
}

function replaceFetch() {
  if (!('fetch' in window)) return;
  replaceAop(window, EVENTTYPES.FETCH, function (originFetch) {
    return function (url: string, config: Partial<Request> = {}) {
      const sTime = getTimestamp();
      let fetchData = {
        type: EVENTTYPES.FETCH,
        method: config.method || 'GET',
        url,
        sTime,
        requestData: config.body,
        response: '',
      };
      return originFetch
        .apply(window, [url, config])
        .then((res: any) => {
          if (isFilterHttpReq(url)) return res;
          const tempRes = res.clone();
          const eTime = getTimestamp();
          fetchData = Object.assign(fetchData, {
            elapsedTime: eTime - sTime,
            status: tempRes.status,
            statusText: tempRes.statusText,
            time: eTime,
          });
          tempRes.text().then((text: string) => {
            fetchData.response = text;
          });
          notify(EVENTTYPES.FETCH, fetchData);
          return res;
        })
        .catch((err: any) => {
          const eTime = getTimestamp();
          fetchData = Object.assign(fetchData, {
            elapsedTime: eTime - sTime,
            time: eTime,
            status: 0,
            statusText: err.message,
          });
          notify(EVENTTYPES.FETCH, fetchData);
          throw err;
        });
    };
  });
}

// error
function listenError() {
  on(_global, 'error', (e: ErrorEvent) => {
    console.log('error>>>>>', e);

    notify(EVENTTYPES.ERROR, e);
  });
}

// history
let lastHref = window.location.href;
function historyHandle() {
  const oldOnpopstate = _global.onpopstate;
  _global.onpopstate = function (this: any, ...args: any) {
    const to = window.location.href;
    const from = lastHref;
    lastHref = to;
    notify(EVENTTYPES.HISTORY, {
      from,
      to,
    });
    oldOnpopstate?.apply(this, args);
  };

  function replaceStateFn(originFn: VoidFn) {
    return function (this: any, ...args: any[]) {
      const url = args.length > 2 ? args[2] : '';
      if (url) {
        const to = url;
        const from = lastHref;
        lastHref = to;
        notify(EVENTTYPES.HISTORY, {
          from,
          to,
        });
        originFn.apply(this, args);
      }
    };
  }

  replaceAop(_global, 'replaceState', replaceStateFn);
  replaceAop(_global, 'pushState', replaceStateFn);
}

function hashHandle() {
  on(_global, 'hashchange', (e: HashChangeEvent) => {
    notify(EVENTTYPES.HASHCHANGE, e);
  });
}

function handlerejection() {
  on(_global, 'unhandledrejection', (e: PromiseRejectionEvent) => {
    notify(EVENTTYPES.UNHANDLEDREJECTION, e);
  });
}
