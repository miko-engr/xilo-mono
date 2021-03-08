import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("Documents_pkey", ["id"], { unique: true })
@Entity("Documents", { schema: "public" })
export class Documents {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "fileName", length: 255 })
  fileName: string;

  @Column("character varying", { name: "objName", length: 255 })
  objName: string;

  @Column("text", { name: "type", nullable: true })
  type: string | null;

  @Column("text", { name: "contentType", nullable: true })
  contentType: string | null;

  @Column("timestamp with time zone", { name: "createdAt" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updatedAt" })
  updatedAt: Date;

}
