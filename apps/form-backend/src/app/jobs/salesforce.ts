import { SalesforceDynamicService } from '../modules/salesforce-dynamic/salesforce-dynamic.service'

export const updateSalesforce = async (job) => {
  try {
    const {
      companyId,
      email,
      accoutName,
      supportStage,
      onboardingStage,
      onboardingDate,
      liveDate,
      message
    } = job.data

    if (!(companyId || email || accoutName)) {
      return Promise.reject(new Error('Salesforce job missing params'))
    }

    const sfResult = await SalesforceDynamicService.prototype.findAndUpdateRecords({
      companyId,
      email,
      accoutName,
      supportStage,
      onboardingStage,
      onboardingDate,
      liveDate,
      message
    })

    return Promise.resolve({ success: true, result: sfResult })
  } catch (error) {
    console.log('--error', error)
    return Promise.reject(error)
  }
}
