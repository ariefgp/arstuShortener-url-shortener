import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
} from '@nestjs/common';
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

  @Get('/:shortenedUrl')
  async redirectToOriginalUrl(
    @Param('shortenedUrl') shortenedUrl: string,
  ): Promise<{ url: string }> {
    const originalUrl = await this.linksService.getOriginalUrl(shortenedUrl);
    if (!originalUrl) {
      throw new NotFoundException('Shortened URL not found');
    }
    return { url: originalUrl }; // This can be a redirect or simply returning the URL
  }
}
