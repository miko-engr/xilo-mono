import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Answers } from '../../entities/Answers';
import { Conditions } from '../../modules/condition/conditions.entity';
import { Forms } from '../../modules/form/forms.entity';
import { Questions } from '../../entities/Questions';

@Entity("Pages", { schema: "public" })
export class Pages {

    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;

    @Column("character varying", { name: "title", length: 255 })
    title: string;

    @Column("integer", { name: "position" })
    position: number;

    @Column("boolean", { name: "isDriver", nullable: true, default: () => "false", })
    isDriver: boolean | null;

    @Column("boolean", { name: "isVehicle", nullable: true, default: () => "false", })
    isVehicle: boolean | null;

    @Column("timestamp with time zone", { name: "createdAt" })
    createdAt: Date;

    @Column("timestamp with time zone", { name: "updatedAt" })
    updatedAt: Date;

    @Column("integer", { name: "companyPageId", nullable: true })
    companyPageId: number | null;

    @Column("integer", { name: "formPageId", nullable: true })
    formPageId: number | null;

    @Column("boolean", { name: "isHome", nullable: true, default: () => "false", })
    isHome: boolean | null;

    @Column("boolean", { name: "isOwner", nullable: true, default: () => "false", })
    isOwner: boolean | null;

    @Column("boolean", { name: "isStartPage", nullable: true, default: () => "false", })
    isStartPage: boolean | null;

    @Column("boolean", { name: "isDiscountsPage", nullable: true, default: () => "false", })
    isDiscountsPage: boolean | null;

    @Column("boolean", { name: "isResultsPage", nullable: true, default: () => "false", })
    isResultsPage: boolean | null;

    @Column("boolean", { name: "isInsurance", nullable: true, default: () => "false", })
    isInsurance: boolean | null;

    @Column("character varying", 
    {   
        name:"progressButtonText",
        nullable:true,
        length:255,
        default: () => "'Continue &#8594;ALTER TABLE 'Pages' ALTER COLUMN 'progressButtonText' TYPE VARCHAR(255) ;'", })
    progressButtonText:string | null;

    @Column("boolean", { name: "isFormCompletedPage", nullable: true, default: () => "false", })
    isFormCompletedPage: boolean | null;

    @Column("character varying", { name: "formCompletedPageHeader", nullable: true, length: 255 })
    formCompletedPageHeader: string | null;

    @Column("text", { name: "formCompletedPageText", nullable: true })
    formCompletedPageText: string | null;

    @Column("text", { name: "formCompletedPageIcon", nullable: true })
    formCompletedPageIcon: string | null;

    @Column("boolean", { name: "formCompletedPageHasTimer", nullable: true, default: () => "false", })
    formCompletedPageHasTimer: boolean | null;

    @Column("character varying", { name: "routePath", nullable: true, length: 255 })
    routePath: string | null;

    @Column("character varying", { name: "color", nullable: true, length: 255 })
    color: string | null;

    @Column("character varying", { name: "conditionObject", nullable: true, length: 255 })
    conditionObject: string | null;

    @Column("character varying", { name: "conditionKey", nullable: true, length: 255 })
    conditionKey: string | null;

    @Column("character varying", { name: "conditionValue", nullable: true, length: 255 })
    conditionValue: string | null;

    @Column("character varying", { name: "conditionOperator", nullable: true, length: 255 })
    conditionOperator: string | null;

    @Column("boolean", { name: "isTemplate", nullable: true, default: () => "false", })
    isTemplate: boolean | null;

    @Column("character varying", { name: "templateCategory", nullable: true, length: 255 })
    templateCategory: string | null;

    @Column("character varying", { name: "templateTitle", nullable: true, length: 255 })
    templateTitle: string | null;

    @Column("character varying", { name: "otherOffersTitle", nullable: true, length: 255 })
    otherOffersTitle: string | null;

    @Column("json", { name: "banner", nullable: true })
    banner: object | null;

    @Column("int4", { name: "bundleFormIds", nullable: true, array: true })
    bundleFormIds: number[] | null;

    @Column("boolean", { name: "hasOtherOffers", nullable: true, default: () => "false", })
    hasOtherOffers: boolean | null;

    @OneToMany(() => Answers, answers => answers.pageAnswer)
    answers: Answers[];

    @OneToMany(() => Conditions, conditions => conditions.pageCondition)
    conditions: Conditions[];

    @ManyToOne(() => Forms, forms => forms.pages , { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn([{ name: "formPageId", referencedColumnName: "id" },
    ])
    formPage: Forms[];

    @OneToMany(() => Questions, questions => questions.pageQuestion)
    questions: Questions[];

}
