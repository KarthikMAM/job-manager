import FIFO from './queues/fifo'
import LIFO from './queues/lifo'

export default class JobManager {
  static queueTypes = { LIFO, FIFO }

  static defaultOptions = {
    workers: [{
      jobsPerInterval: 1,
      interval: 100,
    }],
    queueType: JobManager.queueTypes.LIFO,
  }

  constructor (options = {}) {
    this.options = { ...JobManager.defaultOptions, ...options }
    this.workers = []
    this.queue = new options.queueType() // eslint-disable-line new-cap
  }

  dispatch = (job) => new Promise((resolve, reject) => this.queue.add(() => {
    try {
      resolve(job())
    } catch (e) {
      reject(e)
    }
  }))

  start = () => {
    if (this.workers.length !== 0) return

    this.workers = this.options.workers.map(worker => setInterval(this.dispatcher(worker.jobsPerInterval), worker.interval))
  }

  purgeQueue = () => this.queue.purge()

  dispatcher = (jobsToFinish) => {
    return () => {
      for (let i = 0; i < jobsToFinish; i++) {
        if (!this.queue.hasMore()) break

        this.queue.getNext()()
      }
    }
  }

  stop = () => {
    while (this.workers.length > 0) clearInterval(this.workers.pop())
  }
}
