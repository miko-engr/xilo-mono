import {
  HttpException,
  Injectable,
  Scope,
  HttpStatus
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Clients } from '../client/client.entity'
import { Companies } from '../company/company.entity'
// import { MessagingResponse } from 'twilio'

@Injectable({ scope: Scope.REQUEST })
export class TextCallbackService {
  constructor(
    @InjectRepository(Clients) private clientRepository: Repository<Clients>,
    @InjectRepository(Companies) private companyRepository: Repository<Companies>,
) {}

  async messageListner (req, res) {
    try {
      const company = await this.companyRepository.findOne({
        where: { companyId: req.params.companyId }
      })
      const io = req.app.get('socketio')
      if (!company || !company.textConfig) {
        throw new HttpException('Company not found!', HttpStatus.BAD_REQUEST)
      }

      const number = req.body.From
      if (!req.body.From) {
        throw new HttpException('Phone number not found!', HttpStatus.BAD_REQUEST)
      }

      const phoneValues = []
      if(number.startsWith('+1')) {
        phoneValues.push(number.slice(2, number.length), number.slice(1, number.length), number)
      } else if(number.startsWith('1')) {
        phoneValues.push(number.slice(1, number.length), number, '+' + number)
      } else {
        phoneValues.push(number, '1' +number, '+1' + number)
      }

      const client = await this.clientRepository.findOne({
        where:{ phone: phoneValues, companyClientId: company.id },
        select: ['id', 'companyClientId']
      })

      if (!client) {
        throw new HttpException('Phone number not found!', HttpStatus.BAD_REQUEST)
      }
      // TO DO: Depends on flow helper
      // const response = await flowHelper.removeFromFlow(client.id, client.companyClientId)
      
      const config = company.textConfig
      const newTextObj = {
        to: config['from'],
        body: req.body.Body,
        fromClient: true,
        isSchedule: false,
        scheduledDate: new Date(),
        status: 'Unread',
        companyTextMessageId: company.id,
        clientTextMessageId: client.id
      }
      // TODO need to check with test-message
      // const newText = await TextMessage.create(newTextObj)

      // const twilioResponse = new MessagingResponse()
      
      io.emit('texts', {status: true})

      res.writeHead(200, {'Content-Type': 'text/xml'})
      // res.end(twilioResponse.toString())
  
      // return {
      //  data: response
      // }
    } catch (error) {
      return { status: false, error }
    }
  }
}
