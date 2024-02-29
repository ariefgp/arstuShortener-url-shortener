import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { clearRepositories, createNestApplication } from '../test-helpers';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

describe('Links', () => {
  let app: INestApplication;
  let dbConnection: Connection;

  async function createLink(name: string, url: string): Promise<void> {
    await request(app.getHttpServer()).post('/links').send({ name, url });
  }

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

    it('should return links when data is present', async () => {
      await createLink(faker.internet.domainWord(), faker.internet.url());
      await createLink(faker.internet.domainWord(), faker.internet.url());
      await createLink(faker.internet.domainWord(), faker.internet.url());

      const res = await request(app.getHttpServer()).get('/links');

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
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

    it('should handle already exists', async () => {
      const name = faker.internet.domainWord();
      const url = faker.internet.url();

      await request(app.getHttpServer()).post('/links').send({ name, url });

      const res = await request(app.getHttpServer())
        .post('/links')
        .send({ name, url });
      expect(res.status).toBe(409);
    });

    it('should accept valid data', async () => {
      const name = faker.internet.domainWord();
      const url = faker.internet.url();
      const res = await request(app.getHttpServer())
        .post('/links')
        .send({ name, url });
      expect(res.status).toBe(201);
      expect(res.body).toEqual(expect.objectContaining({ name, url }));
    });

    it('should handle unexpected error', async () => {
      const res = await request(app.getHttpServer())
        .post('/links')
        .send({ name: null, url: null });
      expect(res.status).toBe(400);
    });
  });

  describe('/links (DELETE)', () => {
    it('should NOT accept invalid id', async () => {
      const invalidId = 'invalid-id';
      const res = await request(app.getHttpServer()).delete(
        `/links/${invalidId}`,
      );
      expect(res.status).toBe(500);
    });

    it('should handle not found', async () => {
      const nonExistentId = faker.datatype.uuid();
      const res = await request(app.getHttpServer()).delete(
        `/links/${nonExistentId}`,
      );
      expect(res.status).toBe(404);
    });

    it('should handle delete', async () => {
      const { body: link } = await request(app.getHttpServer())
        .post('/links')
        .send({ name: faker.internet.domainWord(), url: faker.internet.url() });
      const res = await request(app.getHttpServer()).delete(
        `/links/${link.id}`,
      );
      expect(res.status).toBe(200);
    });
  });

  describe('/links/:name (GET)', () => {
    it('should handle not found', async () => {
      const nonExistentName = faker.internet.domainWord();
      const res = await request(app.getHttpServer()).get(
        `/links/${nonExistentName}`,
      );
      expect(res.status).toBe(404); // 404 Not Found for non-existent resources
    });

    it('should handle redirect', async () => {
      const name = faker.internet.domainWord();
      const url = faker.internet.url();
      await request(app.getHttpServer()).post('/links').send({ name, url });

      const res = await request(app.getHttpServer())
        .get(`/links/${name}`)
        .redirects(0);

      expect(res.status).toBe(301);
      expect(res.headers.location).toBe(url);
    });
  });
});
