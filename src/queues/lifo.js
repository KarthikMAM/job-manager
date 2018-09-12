export default class LIFO {
  constructor () {
    this.queue = []
  }

  getNext = () => this.queue.pop()

  add = (job) => this.queue.push(job)

  hasMore = () => this.queue.length > 0

  purge = () => { this.queue = [] }
}
