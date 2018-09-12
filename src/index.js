export default class QueueManager {
  constructor (options = QueueManager.options) {
    this.options = options
    this.queue = []
    this.workers = []
  }

  static options = {
    workers: [{
      count: 1,
      interval: 100,
    }],
  }

  enqueue (job) {
    return new Promise((resolve) => this.queue.push(() => resolve(job())))
  }

  purge () {
    this.queue = []
  }

  start () {
    if (this.workers.length !== 0) return

    this.workers = this.options.workers.map(worker => setInterval(this.dispatcher(worker.count), worker.interval))
  }

  dispatcher (count) {
    return () => {
      for (let i = 0; i < count; i++) {
        if (this.queue.length <= 0) break

        this.queue.pop()()
      }
    }
  }

  stop () {
    while (this.workers.length > 0) clearInterval(this.workers.pop())
  }
}
