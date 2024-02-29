import { Module } from '@nestjs/common';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { LinksRepository } from './links.repository';
import { Link } from './link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Link])],
  controllers: [LinksController],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {}
