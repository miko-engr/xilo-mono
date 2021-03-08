import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Clients } from '../client/client.entity';

@Entity('RecreationalVehicles', { schema: 'public' })
export class RecreationalVehicles {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date | null;

  @Column('character varying', { name: 'type', nullable: true, length: 255 })
  type: string | null;

  @Column('integer', { name: 'clientRecreationalVehicleId', nullable: true })
  clientRecreationalVehicleId: number | null;

  @ManyToOne(() => Clients, (clients) => clients.recreationalVehicles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'clientRecreationalVehicleId', referencedColumnName: 'id' },
  ])
  client: Clients;
}
