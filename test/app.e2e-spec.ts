// Make a database for testing
// Everytime run tests, clean up data
// Must call request like we do with Postman
// npx dotenv -e .env.test -- prisma studio

import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';

const PORT = 3002
describe('App EndToEnd tests', () => {
  let app: INestApplication
  let prismaService: PrismaService
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.listen(PORT);
    prismaService = app.get(PrismaService);
    await prismaService.cleanDatabase();
    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });

  describe('Test Authenticaton', () => {
    describe('Resgister', () => {
      it('should show error with email empty', () => {
        return pactum.spec()
              .post('/auth/register')
              .withBody({
                email: '',
                password: 'a123456'
              })
              .expectStatus(400)
              // .inspect()
      })
    })

    describe('Resgister', () => {
      it('should Register', () => {
        return pactum.spec()
              .post('/auth/register')
              .withBody({
                email: 'testemail01@gmail.com',
                password: 'a123456'
              })
              .expectStatus(201)
              // .inspect()
      })
    })

    describe('Login', () => {
      it('should Login', () => {
        return pactum.spec()
              .post('/auth/login')
              .withBody({
                email: 'testemail01@gmail.com',
                password: 'a123456'
              })
              .expectStatus(201)
              .stores('accessToken', "accessToken")
      })
    })
  })

  describe('User', () => {
    describe('Get Detail User', () => {
      it('should Get Detail User', () => {
        return pactum.spec()
              .get('/users/me')
              .withHeaders({
                Authorization: 'Bearer $S{accessToken}',
              })
              .expectStatus(200)
      })
    })
  })

  describe('Note', () => {
    describe('Insert Note 1',() => {
      it('should Insert Note 1', () => {
        return pactum.spec()
              .post('/notes/insert')
              .withHeaders({
                Authorization: 'Bearer $S{accessToken}',
              })
              .withBody({
                title: 'Test Note',
                description: 'This is a test note',
                url: 'www.gg123.com'
              })
              .stores('nodeID1', "id")
              .expectStatus(201)
      })
    })
    describe('Insert Note 2',() => {
      it('should Insert Note 2', () => {
        return pactum.spec()
              .post('/notes/insert')
              .withHeaders({
                Authorization: 'Bearer $S{accessToken}',
              })
              .withBody({
                title: 'Test Note 2',
                description: 'This is a test note 2',
                url: 'www.gg1232.com'
              })
              .stores('nodeID2', "id")
              .expectStatus(201)
      })
    })
    describe('Get All Notes', () => {
      it('should Get All Notes', () => {
        return pactum.spec()
              .get('/notes')
              .withHeaders({
                Authorization: 'Bearer $S{accessToken}',
              })
              .expectStatus(200)
      })
    })
    describe('Get Note By ID', () => { 
      it('should Get Note By ID', () => {
        return pactum.spec()
              .get('/notes/')
              .withHeaders({
                Authorization: 'Bearer $S{accessToken}',
              })
              .withQueryParams('id', '$S{nodeID1}')
              .expectStatus(200)
              .inspect()
      })
    })
    describe('Update Note By ID', () => {
      it('should Update Note By ID', () => {
        return pactum.spec()
              .patch('/notes/')
              .withHeaders({
                Authorization: 'Bearer $S{accessToken}',
              })
              .withQueryParams('id', '$S{nodeID1}')
              .withBody({
                title: 'Updated Test Note',
                description: 'This is an updated test note',
                url: 'www.cc123.com'
              })
              .expectStatus(201)
      })
    })
    describe('Delete Note By ID', () => {
      it('should Delete Note By ID', () => {
        return pactum.spec()
              .delete('/notes/')
              .withHeaders({
                Authorization: 'Bearer $S{accessToken}',
              })
              .withQueryParams('id','$S{nodeID2}')
              .expectStatus(204)
      })
    })
  })

  afterAll(async () => {
    await app.close();
  });

  // it.todo('should PASS')
}) 