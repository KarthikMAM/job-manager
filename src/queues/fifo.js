export default class FIFO {
  constructor () {
    this.queue = []
  }

  getNext () {
    return this.queue.shift()
  }

  add (job) {
    this.queue.push(job)
  }

  hasMore () {
    return this.queue.length > 0
  }

  purge () {
    this.queue = []
  }
}
