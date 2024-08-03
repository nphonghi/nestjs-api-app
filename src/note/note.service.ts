import { ForbiddenException, Injectable } from "@nestjs/common";
import { InsertNoteDTO, UpdateNoteDTO } from "./DTO";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NoteService {
    constructor(private prismaService: PrismaService) {}
    getNotes(userID: number) {
        const notes = this.prismaService.note.findMany({
            where: {
                userId: userID
            }
        })
        return notes
    }

    getNoteByID(noteID: number) {
        const note = this.prismaService.note.findUnique({
            where: {
                id: noteID
            }
        })
        if (!note) {
            throw new ForbiddenException('Cannot find Note to update')
        }
        return note;
    }

    async insertNote(
        userID: number,
        insertNoteDTO: InsertNoteDTO
    ) {
        const note = await this.prismaService.note.create({
            data: {
                title: insertNoteDTO.title,
                description: insertNoteDTO.description,
                url: insertNoteDTO.url,
                userId: userID
            }
        })
        return note
    }

    updateNoteByID(
        noteID: number,
        updateNoteByID: UpdateNoteDTO
    ) {
        const note = this.prismaService.note.findUnique({
            where: {
                id: noteID
            }
        })
        if (!note) {
            throw new ForbiddenException('Cannot find Note to update')
        }

        return this.prismaService.note.update({
            where: {
                id: noteID
            },
            data: {
                ...updateNoteByID
            }
        })
    }

    deleteNoteByID(noteID: number) {
        const note = this.prismaService.note.findUnique({
            where: {
                id: noteID
            }
        })
        if (!note) {
            throw new ForbiddenException('Cannot find Note to delete')
        }

        return this.prismaService.note.delete({
            where: {
                id: noteID
            }
        })
    }
}