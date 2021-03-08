import { Module } from '@nestjs/common';
import { AppImageController } from './app-image.controller';
import { AppImageService } from './app-image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppImages } from './app-images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppImages])],
  controllers: [AppImageController],
  providers: [AppImageService],
})
export class AppImageModule {}
