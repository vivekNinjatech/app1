import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }
    @Get('me')
    getMe(
        @GetUser() user: User,
        @GetUser('email') email: string) {
        {
            console.log(email);
            return user
        }

    }

    @Patch('edit-user')
    editUser(
        @GetUser('id') userId: number, @Body() dto: EditUserDto
    ) {
        return this.editUser(userId, dto);
    }
}
