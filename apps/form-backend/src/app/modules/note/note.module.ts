import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notes } from './note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notes])],
  providers: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
