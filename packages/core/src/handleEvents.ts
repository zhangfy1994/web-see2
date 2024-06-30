import { EVENTTYPES, STATUS_CODE } from '@websee2/common';
import { ErrorTarget, HttpData, RouteHistory } from '@websee2/types';
import ErrorStackParser from 'error-stack-parser';
import { handleHttpData } from './help';
import { globalOptions } from './options';
import { breadcrumb } from './breadcrumb';
import { transportData } from './reportData';
import { getErrorUid, getTimestamp } from '@websee2/utils';
import { hasExitHash } from './global';

export const HandleEvents = {
  handleHttp(data: HttpData, type: EVENTTYPES) {
    const transformData = handleHttpData(data);
    if (!data.url.includes(globalOptions.dsn)) {
      breadcrumb.push({
        type,
        category: breadcrumb.getCategory(type),
        data: transformData,
        status: transformData.status,
        time: data.time,
      });
    }
    if (transformData.statusType === STATUS_CODE.ERROR) {
      transportData.send(transformData);
    }
  },
  handleError(err: ErrorTarget) {
    const target = err.target;
    const stackFrame = ErrorStackParser.parse(!target ? err : err.error)[0];
    const { fileName, columnNumber, lineNumber } = stackFrame;
    const errorData = {
      type: EVENTTYPES.ERROR,
      time: getTimestamp(),
      statusType: STATUS_CODE.ERROR,
      fileName,
      col: columnNumber,
      line: lineNumber,
      message: err.message,
    };

    breadcrumb.push({
      type: EVENTTYPES.ERROR,
      category: breadcrumb.getCategory(EVENTTYPES.ERROR),
      data: errorData,
      time: errorData.time,
    });

    const hash = getErrorUid(
      `${err.message};${fileName}:${columnNumber}:${lineNumber}`,
    );

    if (!hasExitHash(hash)) {
      transportData.send(errorData);
    }
  },

  handleHistory(data: RouteHistory) {
    const { from, to } = data;
    breadcrumb.push({
      type: EVENTTYPES.HISTORY,
      category: breadcrumb.getCategory(EVENTTYPES.HISTORY),
      data: {
        from,
        to,
      },
      time: getTimestamp(),
    });
  },

  handleHashChange(data: HashChangeEvent) {
    const { newURL: to, oldURL: from } = data;
    breadcrumb.push({
      type: EVENTTYPES.HASHCHANGE,
      category: breadcrumb.getCategory(EVENTTYPES.HASHCHANGE),
      data: {
        from,
        to,
      },
      time: getTimestamp(),
    });
  },

  handleunrejection(data: PromiseRejectionEvent) {
    if (typeof data.reason === 'string') return;
    const stackFrame = ErrorStackParser.parse(data.reason)[0];
    const { fileName, columnNumber, lineNumber } = stackFrame;
    const errorData = {
      type: EVENTTYPES.UNHANDLEDREJECTION,
      time: getTimestamp(),
      statusType: STATUS_CODE.ERROR,
      fileName,
      col: columnNumber,
      line: lineNumber,
      message: data.reason.message,
      stack: data.reason.stack,
    };
    breadcrumb.push({
      type: EVENTTYPES.UNHANDLEDREJECTION,
      category: breadcrumb.getCategory(EVENTTYPES.UNHANDLEDREJECTION),
      data: errorData,
      time: errorData.time,
    });

    const hash = getErrorUid(
      `${data.reason.message};${fileName}:${columnNumber}:${lineNumber}`,
    );
    if (!hasExitHash(hash)) {
      transportData.send(errorData);
    }
  },
};
