import { VoidFn } from '@websee2/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class Queue {
  private stack: any[] = [];
  private isFlushing = false;

  addFn(fn: VoidFn) {
    this.stack.push(fn);

    if (!this.isFlushing) {
      this.isFlushing = true;
      if ('requestIdleCallback' in window) {
        requestIdleCallback(this.flush.bind(this));
      } else if ('Promise' in window) {
        Promise.resolve().then(this.flush.bind(this));
      } else {
        setTimeout(this.flush.bind(this), 0);
      }
    }
  }

  flush() {
    const temp = this.stack.slice(0);
    this.stack = [];
    this.isFlushing = false;
    temp.forEach((fn) => {
      fn();
    });
  }

  clear() {
    this.stack = [];
  }
}
