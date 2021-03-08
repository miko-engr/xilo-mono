import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Emails } from '../email/emails.entity';
import { Clients } from '../client/client.entity';
import { Companies } from '../company/company.entity';
import { TextMessages } from '../text-messages/TextMessages.entity';

@Entity('Flows', { schema: 'public' })
export class Flows {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'title',
    nullable: true,
    length: 255,
    default: () => null,
  })
  title: string | null;

  @Column('boolean', {
    name: 'isEnabled',
    nullable: true,
    default: () => false,
  })
  isEnabled: boolean | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column('boolean', {
    name: 'isNewClientFlow',
    nullable: true,
    default: () => false,
  })
  isNewClientFlow: boolean | null;

  @Column('json', { name: 'sequence', nullable: true, array: true })
  sequence: object[] | null;

  @Column('integer', { name: 'companyFlowId' })
  companyFlowId: number | null;

  @OneToMany(() => Clients, (clients) => clients.flows)
  clients: Clients[];

  @OneToMany(() => Emails, (emails) => emails.flowEmail)
  emails: Emails[];

  @ManyToOne(() => Companies, (companies) => companies.flows, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'companyFlowId', referencedColumnName: 'id' }])
  companyFlow: Companies;

  @OneToMany(() => TextMessages, (textMessages) => textMessages.flowTextMessage)
  textMessages: TextMessages[];
}
