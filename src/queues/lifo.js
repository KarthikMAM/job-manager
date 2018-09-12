export default class LIFO {
  constructor () {
    this.queue = []
  }

  getNext () {
    return this.queue.pop()
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
