import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Zapiersyncs", { schema: "public" })
export class Zapiersyncs {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp with time zone", { name: "createdAt", nullable: true })
  createdAt: Date | null;

  @Column("timestamp with time zone", { name: "updatedAt", nullable: true })
  updatedAt: Date | null;

  @Column("character varying", {
    name: "companyId",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  companyId: string | null;

  @Column("timestamp with time zone", {
    name: "lastSyncTime",
    nullable: true,
    default: () => "'2019-11-14 19:49:40.815-08'",
  })
  lastSyncTime: Date | null;

  @Column("timestamp with time zone", {
    name: "agentLastSyncTime",
    nullable: true,
    default: () => "'2019-11-14 19:49:40.825-08'",
  })
  agentLastSyncTime: Date | null;

  @Column("timestamp with time zone", {
    name: "eventLastSyncTime",
    nullable: true,
    default: () => "'2019-11-14 19:49:40.834-08'",
  })
  eventLastSyncTime: Date | null;

  @Column("timestamp with time zone", {
    name: "lifecycleLastSyncTime",
    nullable: true,
    default: () => "'2020-01-28 21:06:36.221-08'",
  })
  lifecycleLastSyncTime: Date | null;
}
