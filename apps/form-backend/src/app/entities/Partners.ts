import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Companies } from "../modules/company/company.entity";

@Index("Partners_pkey", ["id"], { unique: true })
@Entity("Partners", { schema: "public" })
export class Partners {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "firstName",
    nullable: true,
    length: 255,
  })
  firstName: string | null;

  @Column("character varying", {
    name: "lastName",
    nullable: true,
    length: 255,
  })
  lastName: string | null;

  @Column("character varying", { name: "email", nullable: true, length: 255 })
  email: string | null;

  @Column("character varying", { name: "phone", nullable: true, length: 255 })
  phone: string | null;

  @Column("character varying", { name: "company", nullable: true, length: 255 })
  company: string | null;

  @Column("timestamp with time zone", { name: "createdAt" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updatedAt" })
  updatedAt: Date;

  @ManyToOne(() => Companies, (companies) => companies.partners)
  @JoinColumn([{ name: "companyPartnerId", referencedColumnName: "id" }])
  companyPartner: Companies[];
}
