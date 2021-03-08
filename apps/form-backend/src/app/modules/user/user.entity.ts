import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Companies } from '../company/company.entity';
import { Notes } from '../note/note.entity';
@Entity('Users')
export class Users {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;

  @Column('text', { name: 'name', nullable: true })
  name: string | null;

  @Column('text', { name: 'username' })
  username: string;

  @Column('text', { name: 'firstName' })
  firstName: string;

  @Column('text', { name: 'lastName' })
  lastName: string;

  @Column('text', { name: 'password' })
  password: string;

  @Column('text', { name: 'resetPasswordLink', select: false })
  resetPasswordLink: string;

  @Column('text', { name: 'xanatekProducerId' })
  xanatekProducerId: string;

  @Column('text', { name: 'xanatekCSRId' })
  xanatekCsrId: string;

  @Column('json', { name: 'settings' })
  settings: object;

  @Column('boolean', {
    name: 'showReport',
    nullable: true,
    default: () => true,
  })
  showReport: boolean | null;

  @Column('boolean', {
    name: 'sendReport',
    nullable: true,
    default: () => false,
  })
  sendReport: boolean | null;

  @Column('boolean', {
    name: 'isAdmin',
    nullable: true,
    select: false,
    default: () => true,
  })
  isAdmin: boolean | null;

  @Column('integer', { name: 'companyUserId', nullable: true })
  companyUserId: number | null;

  // @Column('integer', { name: 'companyNoteId', nullable: true })
  // companyNoteId: number | null;

  @ManyToOne(() => Companies, (companies) => companies.users, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'companyUserId', referencedColumnName: 'id' }])
  company: Companies;

  @OneToMany(() => Notes, (notes) => notes.companyNote)
  notes: Notes[];
}
