import { Callback } from '@websee2/types';
import { on } from '@websee2/utils';
import { onCLS, onLCP, onFCP, onTTFB, onINP } from 'web-vitals';
export function isSafari(): boolean {
  return (
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  );
}

export function getCLS(callback: Callback): void {
  let clsValue = 0;
  // let clsEntries = [];

  let sessionValue = 0;
  let sessionEntries: any[] = [];

  const entryHandler = (entryList: any) => {
    for (const entry of entryList.getEntries()) {
      // 只将不带有最近用户输入标志的布局偏移计算在内。
      if (!entry.hadRecentInput) {
        const firstSessionEntry = sessionEntries[0];
        const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
        // 如果条目与上一条目的相隔时间小于 1 秒且
        // 与会话中第一个条目的相隔时间小于 5 秒，那么将条目
        // 包含在当前会话中。否则，开始一个新会话。
        if (
          sessionValue &&
          entry.startTime - lastSessionEntry.startTime < 1000 &&
          entry.startTime - firstSessionEntry.startTime < 5000
        ) {
          sessionValue += entry.value;
          sessionEntries.push(entry);
        } else {
          sessionValue = entry.value;
          sessionEntries = [entry];
        }

        // 如果当前会话值大于当前 CLS 值，
        // 那么更新 CLS 及其相关条目。
        if (sessionValue > clsValue) {
          clsValue = sessionValue;
          // clsEntries = sessionEntries;
          observer.disconnect();

          callback({
            name: 'CLS',
            value: clsValue,
            rating: clsValue > 2500 ? 'poor' : 'good',
          });
        }
      }
    }
  };

  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'layout-shift', buffered: true });
}

function getLCP(fn: (res: any) => void) {
  const observer = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    observer.disconnect();
    for (const entry of entries) {
      fn({
        name: 'LCP',
        value: entry.startTime,
        rating: entry.startTime > 2500 ? 'poor' : 'good',
      });
    }
  });
  observer.observe({ type: 'largest-contentful-paint', buffered: true });
}

function getFCP(fn: (res: any) => void) {
  const observer = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    observer.disconnect();
    for (const entry of entries) {
      if (entry.name === 'first-contentful-paint') {
        fn({
          name: 'LCP',
          value: entry.startTime,
          rating: entry.startTime > 2500 ? 'poor' : 'good',
        });
      }
    }
  });
  observer.observe({ type: 'paint', buffered: true });
}

function getINP(fn: (res: any) => void) {
  const observer = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    observer.disconnect();
    for (const entry of entries) {
      fn({
        name: 'INP',
        value: (entry as any).processingStart - entry.startTime,
        rating:
          (entry as any).processingStart - entry.startTime > 100
            ? 'poor'
            : 'good',
      });
    }
  });
  observer.observe({ type: 'first-input', buffered: true });
}

function getTTFB(fn: (res: any) => void) {
  on(window, 'load', () => {
    const time =
      performance.timing.responseStart - performance.timing.navigationStart;
    fn({
      name: 'TTFB',
      value: time,
      rating: time > 100 ? 'poor' : 'good',
    });
  });
}
export function getWebVitals(fn: (res: any) => void) {
  if (isSafari()) {
    getCLS(fn);
    getLCP(fn);
    getFCP(fn);
    getINP(fn);
    getTTFB(fn);
    return;
  } else {
    onCLS(fn);
    onLCP(fn);
    onFCP(fn);
    onTTFB(fn);
    onINP(fn);
  }
}

export function getLongTask(fn: (res: any) => void) {
  const observer = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    observer.disconnect();
    for (const entry of entries) {
      fn({
        name: 'longTask',
        value: entry.duration,
      });
    }
  });
  observer.observe({ type: 'longtask', buffered: true });
}

function isCache(entry: any) {
  return (
    entry.transferSize === 0 ||
    (entry.transferSize !== 0 && entry.encodedBodySize === 0)
  );
}
export function getResource(fn: (res: any) => void) {
  const observer = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const list = entries.filter((entry) => {
      return !['fetch', 'xmlhttprequest', 'beacon'].includes(
        (entry as any).initiatorType,
      );
    });
    list.forEach((entry) => {
      (entry as any).cache = isCache(entry);
    });
    observer.disconnect();
    fn(list);
  });
  observer.observe({ type: 'resource', buffered: true });
}
