import { Module } from '@nestjs/common';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksRepository } from './links.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LinksRepository])],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
