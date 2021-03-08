import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { Pages } from '../page/page.entity';
import { Answers } from '../../entities/Answers';
import { Questions } from '../../entities/Questions';

@Module({
  imports: [TypeOrmModule.forFeature([Answers, Questions, Pages])],
  providers: [PageService],
  controllers: [PageController],
  exports: [PageService],
})
export class PageModule {}
