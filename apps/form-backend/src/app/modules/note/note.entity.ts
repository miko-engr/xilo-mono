import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Agents } from '../agent/agent.entity';
import { Clients } from '../client/client.entity';
import { Users } from '../user/user.entity';
import { Companies } from '../company/company.entity';

@Entity('Notes', { schema: 'public' })
export class Notes {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'text' })
  text: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column('integer', { name: 'companyNoteId', nullable: true })
  companyNoteId: number | null;

  @ManyToOne(() => Companies, (companies) => companies.notes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'companyNoteId', referencedColumnName: 'id' }])
  companyNote: Companies[];

  @ManyToOne(() => Agents, (agents) => agents.notes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'agentNoteId', referencedColumnName: 'id' }])
  agentNote: Agents[];

  @ManyToOne(() => Clients, (clients) => clients.notes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'clientNoteId', referencedColumnName: 'id' }])
  clients: Clients[];

  @ManyToOne(() => Users, (users) => users.notes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userNoteId', referencedColumnName: 'id' }])
  userNote: Users;
}
