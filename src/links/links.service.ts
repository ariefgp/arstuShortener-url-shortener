import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './link.entity';
import { CreateLinkDto } from './dto/create-link.dto';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>, // Use TypeORM's Repository
  ) {}

  async getAllLinks(): Promise<Link[]> {
    return this.linkRepository.find(); // Use the default repository methods
  }

  async createLink(createLinkDto: CreateLinkDto): Promise<Link> {
    const { name, url } = createLinkDto;
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

  async deleteLink(id: string): Promise<void> {
    const result = await this.linkRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Link with ID "${id}" not found`);
    }
  }
}
