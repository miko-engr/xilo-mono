import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('File', { schema: 'public' })
export class File {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'title',
    nullable: true,
    length: 255,
    default: () => null,
  })
  title: string | null;

  @Column('character varying', {
    name: 'file',
    nullable: true,
    length: 255,
    default: () => null,
  })
  file: string | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
