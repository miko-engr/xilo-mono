import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answers } from './Answers';
import { Conditions } from '../modules/condition/conditions.entity';
import { DynamicRateConditions } from '../modules/dynamic-rate-condition/dynamic-rate-condition.entity';
import { Forms } from '../modules/form/forms.entity';
import { Pages } from '../modules/page/page.entity';

@Index('Questions_pkey', ['id'], { unique: true })
@Entity('Questions', { schema: 'public' })
export class Questions {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'headerText',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  headerText: string | null;

  @Column('character varying', {
    name: 'subHeaderText',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  subHeaderText: string | null;

  @Column('character varying', {
    name: 'nextButtonText',
    nullable: true,
    length: 255,
    default: () => "'Next >'",
  })
  nextButtonText: string | null;

  @Column('character varying', {
    name: 'prevButtonText',
    nullable: true,
    length: 255,
    default: () => "'< Prev'",
  })
  prevButtonText: string | null;

  @Column('text', { name: 'image', nullable: true })
  image: string | null;

  @Column('integer', { name: 'position' })
  position: number;

  @Column('character varying', {
    name: 'errorText',
    nullable: true,
    length: 255,
    default: () => "'Question Is Required'",
  })
  errorText: string | null;

  @Column('boolean', {
    name: 'isRequired',
    nullable: true,
    default: () => 'false',
  })
  isRequired: boolean | null;

  @Column('boolean', {
    name: 'hasCustomHtml',
    nullable: true,
    default: () => 'false',
  })
  hasCustomHtml: boolean | null;

  @Column('text', { name: 'customInputHtml', nullable: true })
  customInputHtml: string | null;

  @Column('timestamp with time zone', { name: 'createdAt' })
  createdAt: Date;

  @Column('timestamp with time zone', { name: 'updatedAt' })
  updatedAt: Date;

  @Column('integer', { name: 'companyQuestionId', nullable: true })
  companyQuestionId: number | null;

  @Column('integer', { name: 'formQuestionId', nullable: true })
  formQuestionId: number | null;

  @Column('boolean', {
    name: 'isClient',
    nullable: true,
    default: () => 'false',
  })
  isClient: boolean | null;

  @Column('boolean', {
    name: 'imageIsSVG',
    nullable: true,
    default: () => 'true',
  })
  imageIsSvg: boolean | null;

  @Column('character varying', {
    name: 'imageUrl',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  imageUrl: string | null;

  @Column('character varying', {
    name: 'conditionObject',
    nullable: true,
    length: 255,
  })
  conditionObject: string | null;

  @Column('character varying', {
    name: 'conditionKey',
    nullable: true,
    length: 255,
  })
  conditionKey: string | null;

  @Column('character varying', {
    name: 'conditionValue',
    nullable: true,
    length: 255,
  })
  conditionValue: string | null;

  @Column('character varying', {
    name: 'conditionOperator',
    nullable: true,
    length: 255,
  })
  conditionOperator: string | null;

  @Column('boolean', {
    name: 'isTemplate',
    nullable: true,
    default: () => 'false',
  })
  isTemplate: boolean | null;

  @Column('character varying', {
    name: 'templateCategory',
    nullable: true,
    length: 255,
  })
  templateCategory: string | null;

  @Column('character varying', {
    name: 'templateTitle',
    nullable: true,
    length: 255,
  })
  templateTitle: string | null;

  @Column('integer', { name: 'scrollBuffer', nullable: true })
  scrollBuffer: number | null;

  @Column('integer', { name: 'pageQuestionId', nullable: true })
  pageQuestionId: number | null;

  @OneToMany(() => Answers, (answers) => answers.questionAnswer)
  answers: Answers[];

  @OneToMany(() => Conditions, (conditions) => conditions.questionCondition)
  conditions: Conditions[];

  @OneToMany(
    () => DynamicRateConditions,
    (dynamicRateConditions) =>
      dynamicRateConditions.question
  )
  dynamicRateConditions: DynamicRateConditions[];

  @ManyToOne(() => Forms, (forms) => forms.Questions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'formQuestionId', referencedColumnName: 'id' }])
  formQuestion: Forms[];

  @ManyToOne(() => Pages, (pages) => pages.questions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'pageQuestionId', referencedColumnName: 'id' }])
  pageQuestion: Pages[];
}
