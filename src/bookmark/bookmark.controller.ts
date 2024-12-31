import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @HttpCode(201)
  @Post('create')
  create(
    @GetUser('id') userId: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.create(userId, createBookmarkDto);
  }

  @HttpCode(200)
  @Get('get-all')
  findAll(@GetUser('id') userId: number) {
    return this.bookmarkService.findAll(userId);
  }

  @HttpCode(200)
  @Get('get-one/:id')
  findOne(@GetUser('id') userId: number, @Param('id') id: number) {
    return this.bookmarkService.findOne(+id, userId);
  }

  @HttpCode(200)
  @Patch('update/:id')
  update(
    @Param('id') id: number,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.update(+id, updateBookmarkDto);
  }

  @HttpCode(200)
  @Delete('delete/:id')
  remove(@Param('id') id: number) {
    return this.bookmarkService.remove(+id);
  }
}
