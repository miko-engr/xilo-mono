import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { Clients } from '../client/client.entity';
import { File } from './file.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Clients, File])],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
