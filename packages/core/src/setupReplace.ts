import { ReplaceHandler } from '@websee2/types';
import { subscribe } from './subscribe';
import { EVENTTYPES } from '@websee2/common';
import { HandleEvents } from './handleEvents';
import { replace } from './replace';

export function setupReplace() {
  // 重写XMLHttpRequest
  addReplaceHandler({
    type: EVENTTYPES.XHR,
    callback: (data) => {
      HandleEvents.handleHttp(data, EVENTTYPES.XHR);
    },
  });

  // 重写fetch
  addReplaceHandler({
    type: EVENTTYPES.FETCH,
    callback: (data) => {
      HandleEvents.handleHttp(data, EVENTTYPES.FETCH);
    },
  });

  // 捕获错误
  addReplaceHandler({
    callback: (error) => {
      HandleEvents.handleError(error);
    },
    type: EVENTTYPES.ERROR,
  });

  // router history
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHistory(data);
    },
    type: EVENTTYPES.HISTORY,
  });

  // router hash
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHashChange(data);
    },
    type: EVENTTYPES.HASHCHANGE,
  });

  // unhandledrejection
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleunrejection(data);
    },
    type: EVENTTYPES.UNHANDLEDREJECTION,
  });
}

function addReplaceHandler(handler: ReplaceHandler) {
  subscribe(handler);
  replace(handler);
}
