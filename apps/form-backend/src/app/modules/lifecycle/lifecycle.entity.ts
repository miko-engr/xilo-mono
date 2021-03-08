import {
  Column,
  Entity,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LifecycleAnalytics } from "../lifecycle-analytics/LifecycleAnalytics.entity"
import { Clients } from "../client/client.entity";
import { Companies } from '../company/company.entity';

@Index("Lifecycles_pkey", ["id"], { unique: true })
@Entity("Lifecycles", { schema: "public" })
export class Lifecycles {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("boolean", {
    name: "isEnabled",
    nullable: true,
    default: () => "false",
  })
  isEnabled: boolean | null;

  @Column("boolean", {
    name: "isNewClient",
    nullable: true,
    default: () => "false",
  })
  isNewClient: boolean | null;

  @Column("boolean", { name: "isSold", nullable: true, default: () => "false" })
  isSold: boolean | null;

  @Column("character varying", {
    name: "name",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  name: string | null;

  @Column("character varying", {
    name: "color",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  color: string | null;

  @Column("integer", { name: "sequenceNumber", nullable: true })
  sequenceNumber: number | null;

  @Column("timestamp with time zone", { name: "createdAt" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updatedAt" })
  updatedAt: Date;

  @Column("boolean", {
    name: "isQuoted",
    nullable: true,
    default: () => "false",
  })
  isQuoted: boolean | null;

  @Column("integer", {
    name: "targetYear",
    nullable: true,
    default: () => "120",
  })
  targetYear: number | null;

  @Column("integer", {
    name: "targetMonth",
    nullable: true,
    default: () => "10",
  })
  targetMonth: number | null;

  @Column("integer", { name: "targetWeek", nullable: true, default: () => "3" })
  targetWeek: number | null;

  @Column("integer", { name: "targetDay", nullable: true, default: () => "1" })
  targetDay: number | null;

  @Column("integer", { name: "companyLifecycleId", nullable: true })
  companyLifecycleId: number;

  @OneToMany(() => Clients, (clients) => clients.lifecycles)
  clients: Clients;

  @OneToMany(
    () => LifecycleAnalytics,
    (lifecycleAnalytics) => lifecycleAnalytics.lifecycleAnalyticLifecycle
  )
  lifecycleAnalytics: LifecycleAnalytics[];

  @OneToMany(
    () => LifecycleAnalytics,
    (lifecycleAnalytics) => lifecycleAnalytics.lifecycleLifecycleAnalytic
  )
  lifecycleAnalytics2: LifecycleAnalytics[];

  @ManyToOne(() => Companies, companies => companies.Lifecycles)
  @JoinColumn({ name: 'companyLifecycleId', referencedColumnName: "id" })
  companies: Companies[];
}
