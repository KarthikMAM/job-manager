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
    this._options = { ...JobManager.defaultOptions, ...options }
    this._workers = []
    this._queue = new this._options.queueType() // eslint-disable-line new-cap
  }

  dispatch = (job, ...args) => new Promise((resolve, reject) => this._queue.add(() => {
    try {
      resolve(job(...args))
    } catch (e) {
      reject(e)
    }
  }))

  start = () => {
    if (this._workers.length !== 0) return

    this._workers = this._options.workers.map(worker => setInterval(this._dispatcher(worker.jobsPerInterval), worker.interval))
  }

  purgeQueue = () => this._queue.purge()

  stop = () => {
    while (this._workers.length > 0) clearInterval(this._workers.pop())
  }

  _dispatcher = (jobsToFinish) => {
    return () => {
      for (let i = 0; i < jobsToFinish; i++) {
        if (!this._queue.hasMore()) break

        this._queue.getNext()()
      }
    }
  }
}
