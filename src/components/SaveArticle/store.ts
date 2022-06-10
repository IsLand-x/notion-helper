import { defineStore } from 'pinia';
export default defineStore('saveArticleStore', () => {
  let flushing = false
  let queue = [] as Array<Function>

  const push = (cb) => {
    queue.push(cb)
    if (!flushing) {
      flushQueue()
    }
  }

  const flushQueue = async () => {
    flushing = true;
    for (const job of queue) {
      await job()
    }
    flushing = false;
    reset()
  }

  const reset = () => {
    queue = []
  }

  return {
    push,
    reset
  }
})