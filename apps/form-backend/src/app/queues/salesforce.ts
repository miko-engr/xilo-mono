import { Queue, Worker } from 'bullmq'
import { redisUrl } from '../constants/appconstant'
import { updateSalesforce } from '../jobs/salesforce'
import IORedis from 'ioredis';

const connection = new IORedis(redisUrl);

const sfQueue = new Queue('salesforceQueue', { connection })
const worker = new Worker('salesforceQueue', async job => {
  await updateSalesforce(job)
}, { connection })

worker.on('completed', (job) => {
  console.log(`${job.id} has completed!`)
})

worker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`)
})

export const addJob = async (jobName, data) => {
  try {
    const job = await sfQueue.add(jobName, data)
    return Promise.resolve({ id: job.id })
  } catch (error) {
    console.log(error)
  }
}
