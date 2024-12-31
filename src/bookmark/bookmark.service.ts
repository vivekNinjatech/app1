import { ForbiddenException, Injectable } from '@nestjs/common';
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

  async update(
    id: number,
    userId: number,
    updateBookmarkDto: UpdateBookmarkDto,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return await this.prisma.bookmark.update({
      where: {
        id,
      },
      data: {
        ...updateBookmarkDto,
      },
    });
  }

  async remove(id: number, userId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return await this.prisma.bookmark.delete({
      where: {
        id,
      },
    });
  }
}
