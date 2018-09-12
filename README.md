# Job Manager

A util to manage in-memory job queues in a multi-worker & rate-limited environments

## Installing

```bash
npm i @karthikmam/job-manager

yarn add @karthikmam/job-manager
```

## Features

This project makes it easy to

- Create a multiple workers with different rate
- Simple to implement rate limits, burst limits etc.
- Support for different types of queues (FIFO, LIFO)
- Promise based API provides easy workflows and error handling capabilities

## Example

A simple ratelimited LIFO jobs scheduler executing 2 jobs per second with a burst execution of 100 jobs every 1 second

```javascript
import JobManager from '@karthikmam/job-manager'

const options = {
  workers: [{
    jobsPerInterval: 2,
    interval: 100
  }, {
    jobsPerInterval: 100,
    interval: 1000
  }],
  queueType: JobManager.queueTypes.LIFO,
}

const jobManager = new JobManager(options)

jobManager.start()

[1,2,3,4,5].forEach(i => {
  jobManager
    .dispatch(() => i * 2)
    .then(result => console.log(`Result of Job${i} is ${result}`))
    .catch(error => console.log(error))
})
```

## Constructor Options

| Option     | key       | Description                                                                                                                                                                                                                                  | Default                               |
| ---------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Workers    | workers   | Specifies the configuration of the worker used to process the jobs in the queue. It is an array having two **required** fields namely `jobsPerInterval` and `interval (in milliseconds)`.                                                    | [{jobsPerInterval: 1, interval: 100}] |
| Queue Type | queueType | Specifies the type of the queue. For currently supported type see [Queue Types](https://github.com/KarthikMAM/job-manager/blob/master/src/index.js#L5) and [Queue Sources](https://github.com/KarthikMAM/job-manager/tree/master/src/queues) | JobManager.queueTypes.LIFO            |

