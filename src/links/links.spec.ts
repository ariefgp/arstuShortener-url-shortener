import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { clearRepositories, createNestApplication } from '../test-helpers';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

describe('Links', () => {
  let app: INestApplication;
  let dbConnection: Connection;

  beforeAll(async () => {
    app = await createNestApplication({
      onBeforeInit: (moduleRef) => {
        dbConnection = moduleRef.get(Connection);
      },
    });
  });

  beforeEach(async () => {
    await clearRepositories(dbConnection);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/links (GET)', () => {
    it('should handle without data', async () => {
      const res = await request(app.getHttpServer()).get('/links');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('/links (POST)', () => {
    it('should create a new link', async () => {
      const name = faker.internet.domainWord();
      const url = faker.internet.url();

      const res = await request(app.getHttpServer())
        .post('/links')
        .send({ name, url });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(expect.objectContaining({ name, url }));
    });
  });
});
