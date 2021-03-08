import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("feedback_pkey", ["id"], { unique: true })
@Entity("feedback", { schema: "public" })
export class Feedback {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "type", nullable: true, length: 255 })
  type: string | null;

  @Column("character varying", { name: "formId", nullable: true, length: 255 })
  formId: string | null;

  @Column("character varying", {
    name: "questionId",
    nullable: true,
    length: 255,
  })
  questionId: string | null;

  @Column("character varying", { name: "userId", nullable: true, length: 255 })
  userId: string | null;

  @Column("character varying", {
    name: "feedback",
    nullable: true,
    length: 255,
  })
  feedback: string | null;
}
