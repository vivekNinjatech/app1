import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';

describe('App e2e test', () => {
  // declaring app
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    describe('signup', () => {
      it('should throw error if email is empty', () => {
        return pactum
          .spec()
          .post(`/auth/signup`)
          .withBody({ password: '123456' })
          .expectStatus(400);
      });
      it('should throw error if password is empty', () => {
        return pactum
          .spec()
          .post(`/auth/signup`)
          .withBody({ email: 'test1@gmail.com' })
          .expectStatus(400);
      });
      it('should throw error if no body', () => {
        return pactum.spec().post(`/auth/signup`).expectStatus(400);
      });
      it('should signup', () => {
        const dto: AuthDto = {
          email: 'test7@gmail.com',
          password: '123456',
          firstName: 'first-name',
          lastName: 'last-name',
        };
        return pactum
          .spec()
          .post(`/auth/signup`)
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('signin', () => {
      describe('signup', () => {
        it('should throw error if email is empty', () => {
          return pactum
            .spec()
            .post(`/auth/signup`)
            .withBody({ password: '123456' })
            .expectStatus(400);
        });
        it('should throw error if password is empty', () => {
          return pactum
            .spec()
            .post(`/auth/signup`)
            .withBody({ email: 'test7@gmail.com' })
            .expectStatus(400);
        });
        it('should throw error if no body', () => {
          return pactum.spec().post(`/auth/signup`).expectStatus(400);
        });
        it('should signin', () => {
          return pactum
            .spec()
            .post(`/auth/login`)
            .withBody({ email: 'test7@gmail.com', password: '123456' })
            .expectStatus(200)
            .stores('userAt', 'access_token');
        });
      });
    });
  });

  describe('User', () => {
    describe('getMe', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get(`/users/me`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('editUser', () => {
      it('should edit user', () => {
        const dto = {
          // email: "test44@gmail.com",
          firstName: 'first-name44',
          lastName: 'last-name44',
        };
        return pactum
          .spec()
          .patch(`/users/edit`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });

  describe('Bookmark', () => {
    describe('createBookmark', () => {
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post(`/bookmarks/create`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            title: 'title',
            link: 'link',
            description: 'description',
          })
          .expectStatus(201);
      });
    });

    describe('getBookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get(`/bookmarks/get-all`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('getBookmarkById', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get(`/bookmarks/get-one/1`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('editBookmark', () => {
      it('should edit bookmark', () => {
        const dto = {
          title: 'updated-title',
          link: 'updated-link',
          description: 'updated-description',
        };
        return pactum
          .spec()
          .patch(`/bookmarks/update/1`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200);
      });
    });

    describe('deleteBookmark', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete(`/bookmarks/delete/1`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('getAllBookmarks', () => {
      it('should get all bookmarks', () => {
        return pactum
          .spec()
          .get(`/bookmarks/get-all-bookmarks`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    
  });
});
