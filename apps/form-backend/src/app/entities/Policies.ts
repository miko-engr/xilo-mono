import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Clients } from "../modules/client/client.entity";
import { Companies } from "../modules/company/company.entity";

@Index("Policies_pkey", ["id"], { unique: true })
@Entity("Policies", { schema: "public" })
export class Policies {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "typeOfInsurance",
    nullable: true,
    length: 255,
  })
  typeOfInsurance: string | null;

  @Column("character varying", {
    name: "namedInsured",
    nullable: true,
    length: 255,
  })
  namedInsured: string | null;

  @Column("character varying", { name: "carrier", nullable: true, length: 255 })
  carrier: string | null;

  @Column("character varying", { name: "agency", nullable: true, length: 255 })
  agency: string | null;

  @Column("character varying", {
    name: "producer",
    nullable: true,
    length: 255,
  })
  producer: string | null;

  @Column("character varying", {
    name: "insuranceLetter",
    nullable: true,
    length: 255,
  })
  insuranceLetter: string | null;

  @Column("character varying", {
    name: "carrierNaic",
    nullable: true,
    length: 255,
  })
  carrierNaic: string | null;

  @Column("character varying", {
    name: "causesOfLoss",
    nullable: true,
    length: 255,
  })
  causesOfLoss: string | null;

  @Column("character varying", {
    name: "policyNumber",
    nullable: true,
    length: 255,
  })
  policyNumber: string | null;

  @Column("character varying", {
    name: "effectiveDate",
    nullable: true,
    length: 255,
  })
  effectiveDate: string | null;

  @Column("character varying", {
    name: "expirationDate",
    nullable: true,
    length: 255,
  })
  expirationDate: string | null;

  @Column("character varying", {
    name: "coveredProperty",
    nullable: true,
    length: 255,
  })
  coveredProperty: string | null;

  @Column("character varying", {
    name: "coverageLimit1",
    nullable: true,
    length: 255,
  })
  coverageLimit1: string | null;

  @Column("character varying", {
    name: "coverageLimit2",
    nullable: true,
    length: 255,
  })
  coverageLimit2: string | null;

  @Column("character varying", {
    name: "coverageLimit3",
    nullable: true,
    length: 255,
  })
  coverageLimit3: string | null;

  @Column("character varying", {
    name: "coverageLimit4",
    nullable: true,
    length: 255,
  })
  coverageLimit4: string | null;

  @Column("character varying", {
    name: "coverageLimit5",
    nullable: true,
    length: 255,
  })
  coverageLimit5: string | null;

  @Column("character varying", {
    name: "coverageLimit6",
    nullable: true,
    length: 255,
  })
  coverageLimit6: string | null;

  @Column("character varying", {
    name: "coverageLimit7",
    nullable: true,
    length: 255,
  })
  coverageLimit7: string | null;

  @Column("character varying", {
    name: "coverageLimit8",
    nullable: true,
    length: 255,
  })
  coverageLimit8: string | null;

  @Column("character varying", {
    name: "coverageLimit9",
    nullable: true,
    length: 255,
  })
  coverageLimit9: string | null;

  @Column("character varying", {
    name: "coverageLimit10",
    nullable: true,
    length: 255,
  })
  coverageLimit10: string | null;

  @Column("timestamp with time zone", { name: "createdAt" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updatedAt" })
  updatedAt: Date;

  @Column("character varying", {
    name: "coverageName1",
    nullable: true,
    length: 255,
  })
  coverageName1: string | null;

  @Column("character varying", {
    name: "coverageName2",
    nullable: true,
    length: 255,
  })
  coverageName2: string | null;

  @Column("character varying", {
    name: "coverageName3",
    nullable: true,
    length: 255,
  })
  coverageName3: string | null;

  @Column("character varying", {
    name: "coverageName4",
    nullable: true,
    length: 255,
  })
  coverageName4: string | null;

  @Column("character varying", {
    name: "coverageName5",
    nullable: true,
    length: 255,
  })
  coverageName5: string | null;

  @Column("character varying", {
    name: "coverageName6",
    nullable: true,
    length: 255,
  })
  coverageName6: string | null;

  @Column("character varying", {
    name: "coverageName7",
    nullable: true,
    length: 255,
  })
  coverageName7: string | null;

  @Column("character varying", {
    name: "coverageName8",
    nullable: true,
    length: 255,
  })
  coverageName8: string | null;

  @Column("character varying", {
    name: "coverageName9",
    nullable: true,
    length: 255,
  })
  coverageName9: string | null;

  @Column("character varying", {
    name: "coverageName10",
    nullable: true,
    length: 255,
  })
  coverageName10: string | null;

  @Column("character varying", {
    name: "subPolicyType",
    nullable: true,
    length: 255,
  })
  subPolicyType: string | null;

  @Column("varchar", {
    name: "coveredPropertyList",
    nullable: true,
    array: true,
  })
  coveredPropertyList: string[] | null;

  @Column("varchar", { name: "causesOfLossList", nullable: true, array: true })
  causesOfLossList: string[] | null;

  @Column("varchar", { name: "clientPolicyId", nullable: true})
  clientPolicyId: number | null;

  @Column("varchar", { name: "companyPolicyId", nullable: true})
  companyPolicyId: number | null;

  @ManyToOne(() => Clients, (clients) => clients.policies, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "clientPolicyId", referencedColumnName: "id" }])
  clientPolicy: Clients[];

  @ManyToOne(() => Companies, (companies) => companies.policies)
  @JoinColumn([{ name: "companyPolicyId", referencedColumnName: "id" }])
  companyPolicy: Companies[];
}
