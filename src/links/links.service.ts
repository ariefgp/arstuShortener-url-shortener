import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './link.entity';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>, // Use TypeORM's Repository
  ) {}

  async getAllLinks(): Promise<Link[]> {
    return this.linkRepository.find(); // Use the default repository methods
  }

  async createLink(name: string, url: string): Promise<Link> {
    const link = this.linkRepository.create({ name, url });
    await this.linkRepository.save(link);
    return link;
  }

  async findByShortenedUrl(shortenedUrl: string): Promise<Link> {
    return this.linkRepository.findOne({
      where: { name: shortenedUrl },
    });
  }

  async getOriginalUrl(shortenedUrl: string): Promise<string> {
    const link = await this.findByShortenedUrl(shortenedUrl);
    if (!link) {
      throw new Error('Shortened URL not found');
    }
    return link.url;
  }
}
