import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Clients } from "../client/client.entity";
import { Companies } from "../company/company.entity";
import { Coverages } from "../coverage/coverages.entity";
import { Homes } from "../home/homes.entity";
import { Vehicles } from "../../entities/Vehicles";

@Index("Rates_pkey", ["id"], { unique: true })
@Entity("Rates", { schema: "public" })
export class Rates {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "title", length: 255 })
  title: string;

  @Column("integer", { name: "price", nullable: true })
  price: number | null;

  @Column("timestamp with time zone", { name: "createdAt" })
  createdAt: Date;

  @Column("timestamp with time zone", { name: "updatedAt" })
  updatedAt: Date;

  @Column('number', { name: 'companyRateId', nullable: true})
  companyRateId: number | null;

  @Column('number', { name: 'clientRateId', nullable: true })
  clientRateId: number | null;

  @Column("character varying", { name: "type", nullable: true, length: 255 })
  type: string | null;

  @ManyToOne(() => Clients, (clients) => clients.rates, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "clientRateId", referencedColumnName: "id" }])
  clientRate: Clients[];

  @ManyToOne(() => Companies, (companies) => companies.rates, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "companyRateId", referencedColumnName: "id" }])
  companyRate: Companies[];

  // @ManyToOne(() => Companies, (companies) => companies.rates2, {
  //   onDelete: "CASCADE",
  //   onUpdate: "CASCADE",
  // })
  // @JoinColumn([{ name: "companyRaterId", referencedColumnName: "id" }])
  // companyRater: Companies;

  @ManyToOne(() => Coverages, (coverages) => coverages.rates, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "coverageRateId", referencedColumnName: "id" }])
  coverageRate: Coverages;

  @ManyToOne(() => Homes, (homes) => homes.rates, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "homeRateId", referencedColumnName: "id" }])
  homeRate: Homes[];

  @ManyToOne(() => Vehicles, (vehicles) => vehicles.rates, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "vehicleRateId", referencedColumnName: "id" }])
  vehicleRate: Vehicles[];
}
