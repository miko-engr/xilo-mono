import { V2EzlynxService } from '../modules/v2-ezlynx/v2-ezlynx.service'
import { Clients } from '../modules/client/client.entity';
import { Repository } from 'typeorm';

const clientsRepository: Repository<Clients>
export const integrate = async(job) => {
        try {
            const { 
                vendorName,
                clientId,
                type,
                token
             } = job.data;

             const data = {
                 vendorName, clientId, type, token
             };

            if (!vendorName) {
                return Promise.reject(new Error('Integrations job missing type'));
            }

            let result = null;
            if (vendorName === 'EZLYNX') {
                result = await V2EzlynxService.prototype.createApplicantMethod(data);
            }

            if (result && result.status) {
                const client = await clientsRepository.findOne({
                    where: { id: clientId }
                });
                client.validationsPassed = true;
                await clientsRepository.save(client);
                await job.update({
                    validations: result.validations,
                    clientId: clientId,
                    passed: true
                });
                return Promise.resolve({ success: true, result: result });
            } else {
                const client = await clientsRepository.findOne({
                    where: { id: clientId }
                });
                client.validationsPassed = false;
                await clientsRepository.save(client);
                const error = result.error ? result.error.toString() : `${vendorName} Integration failed`;
                await job.update({
                    passed: false, 
                    reason: error,
                    clientId: clientId,
                    validations: result.validations
                });
                return Promise.reject(new Error(error));
            }
        } catch(error) {
            return Promise.reject(error);
        }
    },
}
