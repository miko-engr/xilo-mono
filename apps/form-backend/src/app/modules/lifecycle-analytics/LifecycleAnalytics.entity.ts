import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Agents } from "../agent/agent.entity";
import { Clients } from "../client/client.entity";
import { Lifecycles } from "../lifecycle/lifecycle.entity";
import { Companies } from '../company/company.entity';

@Entity("LifecycleAnalytics", { schema: "public" })
export class LifecycleAnalytics {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp with time zone", { name: "date", nullable: true })
  date: Date | null;

  @Column("character varying", { name: "month", nullable: true, length: 255 })
  month: string | null;

  @Column("character varying", { name: "day", nullable: true, length: 255 })
  day: string | null;

  @Column("character varying", { name: "year", nullable: true, length: 255 })
  year: string | null;

  @Column("timestamp with time zone", { name: "createdAt" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updatedAt" })
  updatedAt: Date;

  @Column("integer", { name: "companyLifecycleAnalyticId", nullable: true })
  companyLifecycleAnalyticId: number | null;

  @Column("integer", { name: "lifecycleLifecycleAnalyticId", nullable: true })
  lifecycleLifecycleAnalyticId: number | null;

  @Column("integer", { name: "agentLifecycleAnalyticId", nullable: true })
  agentLifecycleAnalyticId: number | null;

  @Column("integer", { name: "clientLifecycleAnalyticId", nullable: true })
  clientLifecycleAnalyticId: number | null

  @Column("character varying", {
    name: "insuranceType",
    nullable: true,
    length: 255,
  })
  insuranceType: string | null;

  @Column("character varying", { name: "medium", nullable: true, length: 255 })
  medium: string | null;

  @Column("character varying", {
    name: "landingPage",
    nullable: true,
    length: 255,
  })
  landingPage: string | null;

  @ManyToOne(() => Agents, (agents) => agents.lifecycleAnalytics, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "agentLifecycleAnalyticId", referencedColumnName: "id" })
  agentLifecycleAnalytic: Agents[];

  @ManyToOne(() => Clients, (clients) => clients.lifecycleAnalytics, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "clientLifecycleAnalyticId", referencedColumnName: "id" },
  ])
  clientLifecycleAnalytic: Clients[];

  @ManyToOne(() => Lifecycles, (lifecycles) => lifecycles.lifecycleAnalytics, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "lifecycleAnalyticLifecycleId", referencedColumnName: "id" },
  ])
  lifecycleAnalyticLifecycle: Lifecycles[];

  @ManyToOne(() => Lifecycles, (lifecycles) => lifecycles.lifecycleAnalytics2, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "lifecycleLifecycleAnalyticId", referencedColumnName: "id" },
  ])
  lifecycleLifecycleAnalytic: Lifecycles[];

  @ManyToOne(() => Companies, (companies) => companies.lifecycleAnalytics, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "companyLifecycleAnalyticId", referencedColumnName: "id" },
  ])
  companies: Companies[];
}
