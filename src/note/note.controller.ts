import { Controller, UseGuards, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { MyJwtGuard } from '../auth/guard';
import { NoteService } from './note.service';
import { GetUser } from '../auth/decorator';
import { InsertNoteDTO, UpdateNoteDTO } from './DTO';


@Controller('notes')

@UseGuards(MyJwtGuard)
export class NoteController {
    constructor(private noteService: NoteService) {}
    @Get()
    getNotes(@GetUser('id') userID: number) {
        return this.noteService.getNotes(userID)
    }

    @Get(':id')
    getNoteByID(@Param('id', ParseIntPipe) noteID: number) {
        return this.noteService.getNoteByID(noteID)
    }

    @Post("insert")
    insertNote(
        @GetUser('id') userID: number,
        @Body() insertNoteDTO: InsertNoteDTO
    ) {
        return this.noteService.insertNote(userID, insertNoteDTO)
    }

    @Patch(':id')
    updateNoteByID(
        @Param('id', ParseIntPipe) noteID: number,
        @Body() updateNoteDTO: UpdateNoteDTO
    ) {
        return this.noteService.updateNoteByID(noteID, updateNoteDTO)
    }

    @Delete(':id')
    deleteNoteByID(@Param('id', ParseIntPipe) noteID: number){
        return this.noteService.deleteNoteByID(noteID)
    }
}
