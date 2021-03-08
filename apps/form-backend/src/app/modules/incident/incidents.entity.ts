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
import { Drivers } from '../driver/drivers.entity';
import { Vehicles } from '../../entities/Vehicles';

@Entity('Incidents', { schema: 'public' })
export class Incidents {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date | null;

  @Column('character varying', { name: 'type', nullable: true, length: 255 })
  type: string | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('timestamp with time zone', { name: 'date', nullable: true })
  date: Date | null;

  @Column('character varying', { name: 'amount', nullable: true, length: 255 })
  amount: string | null;

  @Column('character varying', {
    name: 'propertyDamage',
    nullable: true,
    length: 255,
  })
  propertyDamage: string | null;

  @Column('character varying', {
    name: 'bodilyInjury',
    nullable: true,
    length: 255,
  })
  bodilyInjury: string | null;

  @Column('character varying', {
    name: 'collision',
    nullable: true,
    length: 255,
  })
  collision: string | null;

  @Column('character varying', {
    name: 'medicalPayment',
    nullable: true,
    length: 255,
  })
  medicalPayment: string | null;

  @Column('character varying', {
    name: 'vehicleIndex',
    nullable: true,
    length: 255,
  })
  vehicleIndex: string | null;

  @Column('character varying', { name: 'catLoss', nullable: true, length: 255 })
  catLoss: string | null;

  @Column('integer', { name: 'clientIncidentId', nullable: true })
  clientIncidentId: number | null;

  @Column('integer', { name: 'driverIncidentId', nullable: true })
  driverIncidentId: number | null;

  @Column('integer', { name: 'vehicleIncidentId', nullable: true })
  vehicleIncidentId: number | null;

  @ManyToOne(() => Clients, (clients) => clients.incidents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'clientIncidentId', referencedColumnName: 'id' }])
  client: Clients;

  @ManyToOne(() => Drivers, (drivers) => drivers.incidents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'driverIncidentId', referencedColumnName: 'id' }])
  driver: Drivers;

  @ManyToOne(() => Vehicles, (vehicles) => vehicles.incidents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'vehicleIncidentId', referencedColumnName: 'id' }])
  vehicle: Vehicles;
}
