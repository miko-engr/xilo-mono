import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('AppImages', { schema: 'public' })
export class AppImages {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'image', nullable: true })
  image: string | null;

  @Column('character varying', {
    name: 'form',
    nullable: true,
    length: 255,
    default: () => null,
  })
  form: string | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column('boolean', { name: 'isSVG', nullable: true, default: () => true })
  isSvg: boolean | null;

  @Column('character varying', {
    name: 'imageUrl',
    nullable: true,
    length: 255,
    default: () => null,
  })
  imageUrl: string | null;
}
