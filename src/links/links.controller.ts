import { Body, Controller, Get, Post } from '@nestjs/common';
import { LinksService } from './links.service';
import { Link } from './link.entity';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  getAllLinks() {
    return this.linksService.getAllLinks();
  }

  @Post()
  createLink(
    @Body('name') name: string,
    @Body('url') url: string,
  ): Promise<Link> {
    return this.linksService.createLink(name, url);
  }
}
