import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answers } from '../../entities/Answers';
import { Pages } from '../page/page.entity';
import { Questions } from '../../entities/Questions';

@Entity('Conditions', { schema: 'public' })
export class Conditions {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('timestamp with time zone', { name: 'createdAt', nullable: true })
  createdAt: Date | null;

  @Column('timestamp with time zone', { name: 'updatedAt', nullable: true })
  updatedAt: Date | null;

  @Column('character varying', { name: 'title', nullable: true, length: 255 })
  title: string | null;

  @Column('character varying', { name: 'object', nullable: true, length: 255 })
  object: string | null;

  @Column('character varying', { name: 'key', nullable: true, length: 255 })
  key: string | null;

  @Column('character varying', {
    name: 'operator',
    nullable: true,
    length: 255,
  })
  operator: string | null;

  @Column('character varying', { name: 'value', nullable: true, length: 255 })
  value: string | null;

  @Column('integer', { name: 'answerConditionId', nullable: true })
  answerConditionId: number | null;

  @Column('integer', { name: 'pageConditionId', nullable: true })
  pageConditionId: number | null;

  @Column('integer', { name: 'questionConditionId', nullable: true })
  questionConditionId: number | null;

  @Column('integer', { name: 'companyConditionId', nullable: true })
  companyConditionId: number | null;

  @ManyToOne(() => Answers, (answers) => answers.conditions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'answerConditionId', referencedColumnName: 'id' }])
  answerCondition: Answers[];

  @ManyToOne(() => Pages, (pages) => pages.conditions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'pageConditionId', referencedColumnName: 'id' }])
  pageCondition: Pages[];

  @ManyToOne(() => Questions, (questions) => questions.conditions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'questionConditionId', referencedColumnName: 'id' }])
  questionCondition: Questions[];
}
