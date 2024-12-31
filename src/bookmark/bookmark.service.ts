import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async create(userId: number, dto: CreateBookmarkDto) {
    return await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  findOne(id: number, userId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  update(id: number, updateBookmarkDto: UpdateBookmarkDto) {
    return this.prisma.bookmark.update({
      where: {
        id,
      },
      data: {
        ...updateBookmarkDto,
      },
    });
  }

  remove(id: number) {
    return this.prisma.bookmark.delete({
      where: {
        id,
      },
    });
  }
}
