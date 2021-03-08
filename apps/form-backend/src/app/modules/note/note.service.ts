import {
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Notes } from './note.entity';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable({ scope: Scope.REQUEST })
export class NoteService {
  constructor(
    @InjectRepository(Notes)
    private notesRepository: Repository<Notes>,
    @Inject(REQUEST) private request: Request
  ) {}

  async create(noteBody: CreateNoteDto) {
    try {
      const newNote = await this.notesRepository.save(noteBody);
      if (!newNote) {
        throw new HttpException('Error creating note', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'New note created',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteNote(id: number) {
    try {
      const note = await this.notesRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!note) {
        throw new HttpException('No note found', HttpStatus.BAD_REQUEST);
      }
      const deletedNote = await this.notesRepository.delete(note);
      if (deletedNote.affected === 0) {
        throw new HttpException(
          'There was an error removing note',
          HttpStatus.BAD_REQUEST
        );
      }
      return {
        message: 'note removed successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async list() {
    try {
      const decoded = this.request.body.decodedUser;
      const notes = await this.notesRepository.find({
        companyNoteId: decoded.user.companyUserId,
      });
      if (!notes) {
        throw new HttpException('No notes found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Notes retrieved successfully',
        obj: notes,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listOne(id: number) {
    try {
      const note = await this.notesRepository.findOne({
        where: { id: id },
      });
      if (!note) {
        throw new HttpException('No note found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Note retrieved successfully',
        obj: note,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async listByClient(clientId: number) {
    try {
      const decoded = this.request.body.decodedUser;
      const notes = await this.notesRepository.find({
        where: {
          clientNoteId: clientId,
          companyNoteId: decoded.user.companyUserId,
        },
      });
      if (!notes) {
        throw new HttpException('No notes found', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Notes retrieved successfully',
        obj: notes,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(id: number, noteBody: CreateNoteDto) {
    try {
      const note = await this.notesRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!note) {
        throw new HttpException('No note found', HttpStatus.BAD_REQUEST);
      }
      const updatedNote = await this.notesRepository.save({
        ...note,
        ...noteBody,
      });
      if (!updatedNote) {
        throw new HttpException('Error updating Note', HttpStatus.BAD_REQUEST);
      }
      return {
        title: 'Note updated successfully',
        obj: updatedNote,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
