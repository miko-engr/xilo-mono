import { Queue, Worker } from 'bullmq'
import { redisUrl } from '../constants/appconstant'
import * as integrationJobs from '../jobs/integrations'
import { SocketService } from '../services/socket'
import IORedis from 'ioredis';

const connection = new IORedis(redisUrl);

export const addJob = async (queueName, jobName, data) => {
  try {
    const queue = new Queue(queueName, { connection })

    const worker = new Worker(queueName, async job => {
      console.log(job.id + ': job started')
      if (queueName === 'Integrations') {
        await integrationJobs.integrate(job)
      }
    }, { connection })

    worker.on('completed', async (job) => {
      try {
        const socket = SocketService.getInstance()
        socket.emit(jobName, { job: job })
        console.log(`${job.id} has completed!`)
      } catch (error) {
        console.log(error)
      }
    })

    worker.on('failed', (job, err) => {
      try {
        const socket = SocketService.getInstance()
        socket.emit(jobName, { job: job })
        console.log(`${job.id} has failed with ${err.message}`)
      } catch (error) {
        console.log(error)
      }
    })

    const job = await queue.add(jobName, data)
    return Promise.resolve({ id: job.id })
  } catch (error) {
    console.log(error)
  }
}
