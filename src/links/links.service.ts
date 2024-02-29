import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './link.entity';
import { LinksRepository } from './links.repository';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(LinksRepository)
    private readonly linksRepository: LinksRepository,
  ) {}

  async getAllLinks(): Promise<Array<Link>> {
    return this.linksRepository.find({});
  }
}
