import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
 canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.body.token || request.query.token || request.headers['x-access-token'];
        if (!token) throw new HttpException('Token missing!', HttpStatus.BAD_REQUEST);
        jwt.verify(token, 'secret', async (error, decoded) => {
            if (error) throw new HttpException('Failed to authenticate token.', HttpStatus.BAD_REQUEST)
            if (!decoded) throw new HttpException('Unauthorized user.', HttpStatus.BAD_REQUEST)
            request.body.decodedUser = decoded;
            
            if (decoded.user) {
                request.body.decodedUser.companyId = decoded.user.companyUserId;
            } else if (decoded.agent) {
                request.body.decodedUser.companyId = decoded.agent.companyAgentId;
            } else if (decoded.client) {
                request.body.decodedUser.companyId = decoded.client.companyClientId;
            }
            return request;
        })
    return request;
  }
}
