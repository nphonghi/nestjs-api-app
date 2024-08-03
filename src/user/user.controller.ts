import { Controller, Get, UseGuards } from '@nestjs/common';
import { MyJwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
    @UseGuards(MyJwtGuard)
    @Get('me')
    me(@GetUser() user: User) {
        return user;
    }
}