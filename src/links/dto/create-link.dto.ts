import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @IsNotEmpty()
  name: string; // Shortened URL identifier

  @IsUrl()
  @IsNotEmpty()
  url: string; // Original URL
}
