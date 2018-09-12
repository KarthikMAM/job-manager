import FIFO from './queues/fifo'
import LIFO from './queues/lifo'

export default class QueueManager {
  static queueTypes = { LIFO, FIFO }

  static defaultOptions = {
    workers: [{
      count: 1,
      interval: 100,
    }],
    queueType: QueueManager.queueTypes.LIFO,
  }

  constructor (options = QueueManager.defaultOptions) {
    this.options = options
    this.workers = []
    this.queue = new options.queueType() // eslint-disable-line new-cap
  }

  add = (job) => new Promise((resolve) => this.queue.add(() => resolve(job())))

  start = () => {
    if (this.workers.length !== 0) return

    this.workers = this.options.workers.map(worker => setInterval(this.dispatcher(worker.count), worker.interval))
  }

  purge = () => this.queue.purge()

  dispatcher = (count) => {
    return () => {
      for (let i = 0; i < count; i++) {
        if (!this.queue.hasMore()) break

        this.queue.getNext()()
      }
    }
  }

  stop = () => {
    while (this.workers.length > 0) clearInterval(this.workers.pop())
  }
}
