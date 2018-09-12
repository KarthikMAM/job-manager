export default class FIFO {
  constructor () {
    this.queue = []
  }

  getNext = () => this.queue.shift()

  add = (job) => this.queue.push(job)

  hasMore = () => this.queue.length > 0

  purge = () => { this.queue = [] }
}
