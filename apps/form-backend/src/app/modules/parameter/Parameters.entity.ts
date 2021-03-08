import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answers } from '../../entities/Answers';
import { Companies } from '../company/company.entity';
import { DynamicRaters } from '../dynamic-rater/dynamic-raters.entity';
import { Raters } from '../rater/raters.entity';

@Entity('Parameters', { schema: 'public' })
export class Parameters {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'title', length: 255 })
  title: string;

  @Column('boolean', {
    name: 'isDriver',
    nullable: true,
    default: () => 'false',
  })
  isDriver: boolean | null;

  @Column('boolean', {
    name: 'isVehicle',
    nullable: true,
    default: () => 'false',
  })
  isVehicle: boolean | null;

  @Column('character varying', {
    name: 'propertyKey',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  propertyKey: string | null;

  @Column('character varying', {
    name: 'conditionalValue',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  conditionalValue: string | null;

  @Column('double precision', {
    name: 'percentChange',
    nullable: true,
    precision: 53,
  })
  percentChange: number | null;

  @Column('timestamp with time zone', { name: 'createdAt' })
  createdAt: Date;

  @Column('timestamp with time zone', { name: 'updatedAt' })
  updatedAt: Date;

  @Column('integer', {
    name: 'answerParameterId',
    nullable: true,
  })
  answerParameterId: number;

  @Column('integer', {
    name: 'companyParameterId',
    nullable: true,
  })
  companyParameterId: number;

  @ManyToOne(() => Answers, (answers) => answers.parameters, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'answerParameterId', referencedColumnName: 'id' }])
  answerParameter: Answers[];

  @ManyToOne(() => Companies, (companies) => companies.parameters, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'companyParameterId', referencedColumnName: 'id' }])
  companyParameter: Companies;

  @ManyToOne(() => DynamicRaters, (dynamicRaters) => dynamicRaters.parameters, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'dynamicRaterParameterId', referencedColumnName: 'id' }])
  dynamicRaterParameter: DynamicRaters[];

  @ManyToOne(() => Raters, (raters) => raters.parameters, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'raterParameterId', referencedColumnName: 'id' }])
  raterParameter: Raters[];
}
