import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('link')
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  url: string;
}
