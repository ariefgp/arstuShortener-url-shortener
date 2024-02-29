import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Res,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { Link } from './link.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { Response } from 'express';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  getAllLinks() {
    return this.linksService.getAllLinks();
  }

  @Post()
  createLink(@Body() createLinkDto: CreateLinkDto): Promise<Link> {
    return this.linksService.createLink(createLinkDto);
  }

  @Get('/:shortenedUrl')
  async redirectToOriginalUrl(
    @Param('shortenedUrl') shortenedUrl: string,
    @Res() res: Response,
  ) {
    const originalUrl = await this.linksService.getOriginalUrl(shortenedUrl);
    if (!originalUrl) {
      throw new NotFoundException('Shortened URL not found');
    }
    res.redirect(301, originalUrl);
  }

  @Delete('/:id')
  async deleteLink(@Param('id') id: string) {
    await this.linksService.deleteLink(id);
    return { message: 'Link deleted successfully' };
  }
}
