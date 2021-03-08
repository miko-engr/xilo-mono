import { Controller, Get, Param, Patch, Body, Delete, Post, UseGuards } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteService } from './note.service';
import { AuthGuard } from "../../guards/auth.guard"
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) { }
  @Get(':id')
  listOne(@Param('id') id: number) {
    return this.noteService.listOne(id);
  }

  @Get()
  @UseGuards(AuthGuard)
  list() {
    return this.noteService.list();
  }

  @Get('client/:id')
  @UseGuards(AuthGuard)
  listByClient(@Param('id') id: number) {
    return this.noteService.listByClient(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() noteBody: CreateNoteDto) {
    return this.noteService.update(id, noteBody);
  }

  @Post()
  create(@Body() noteBody: CreateNoteDto) {
    return this.noteService.create(noteBody);
  }

  @Delete(':id')
  deleteNote(@Param('id') id: number) {
    return this.noteService.deleteNote(id);
  }
}
