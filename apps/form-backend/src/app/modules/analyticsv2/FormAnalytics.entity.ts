import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Forms } from '../form/forms.entity';
import { Clients } from '../client/client.entity';

@Entity('FormAnalytics')
export class FormAnalytics {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'ipAddress',
    nullable: true,
    length: 255,
  })
  ipAddress: string | null;

  @Column('character varying', {
    name: 'userAgent',
    nullable: true,
    length: 255,
  })
  userAgent: string | null;

  @Column('character varying', { name: 'pageUrl', length: 255 })
  pageUrl: string;

  @Column('character varying', { name: 'domain', length: 255 })
  domain: string;

  @Column('character varying', { name: 'path', length: 255 })
  path: string;

  @Column('character varying', { name: 'event', length: 255 })
  event: string;

  @Column('character varying', {
    name: 'queryString',
    nullable: true,
    length: 255,
  })
  queryString: string | null;

  @Column('character varying', { name: 'anchor', nullable: true, length: 255 })
  anchor: string | null;

  @Column('character varying', { name: 'geoCity', nullable: true, length: 255 })
  geoCity: string | null;

  @Column('character varying', {
    name: 'geoState',
    nullable: true,
    length: 255,
  })
  geoState: string | null;

  @Column('character varying', {
    name: 'geoCountry',
    nullable: true,
    length: 255,
  })
  geoCountry: string | null;

  @Column('character varying', { name: 'geoCode', nullable: true, length: 255 })
  geoCode: string | null;

  @Column('character varying', {
    name: 'geoZipCode',
    nullable: true,
    length: 255,
  })
  geoZipCode: string | null;

  @Column('character varying', {
    name: 'geoLatitude',
    nullable: true,
    length: 255,
  })
  geoLatitude: string | null;

  @Column('character varying', {
    name: 'geoLongitute',
    nullable: true,
    length: 255,
  })
  geoLongitute: string | null;

  @Column('character varying', {
    name: 'uaBrowserName',
    nullable: true,
    length: 255,
  })
  uaBrowserName: string | null;

  @Column('character varying', {
    name: 'uaBrowserVersion',
    nullable: true,
    length: 255,
  })
  uaBrowserVersion: string | null;

  @Column('character varying', {
    name: 'uaDeviceModel',
    nullable: true,
    length: 255,
  })
  uaDeviceModel: string | null;

  @Column('character varying', {
    name: 'uaDeviceType',
    nullable: true,
    length: 255,
  })
  uaDeviceType: string | null;

  @Column('character varying', {
    name: 'uaDeviceVersion',
    nullable: true,
    length: 255,
  })
  uaDeviceVersion: string | null;

  @Column('character varying', {
    name: 'uaEngineName',
    nullable: true,
    length: 255,
  })
  uaEngineName: string | null;

  @Column('character varying', {
    name: 'uaEngineVersion',
    nullable: true,
    length: 255,
  })
  uaEngineVersion: string | null;

  @Column('character varying', {
    name: 'uaOSName',
    nullable: true,
    length: 255,
  })
  uaOsName: string | null;

  @Column('character varying', {
    name: 'uaOSVersion',
    nullable: true,
    length: 255,
  })
  uaOsVersion: string | null;

  @Column('character varying', {
    name: 'uaCPUArchitecture',
    nullable: true,
    length: 255,
  })
  uaCpuArchitecture: string | null;

  @Column('character varying', {
    name: 'referrerUrl',
    nullable: true,
    length: 255,
  })
  referrerUrl: string | null;

  @Column('character varying', {
    name: 'referrerDomain',
    nullable: true,
    length: 255,
  })
  referrerDomain: string | null;

  @Column('character varying', {
    name: 'referrerPath',
    nullable: true,
    length: 255,
  })
  referrerPath: string | null;

  @Column('character varying', {
    name: 'referrerQueryString',
    nullable: true,
    length: 255,
  })
  referrerQueryString: string | null;

  @Column('character varying', {
    name: 'referrerAnchor',
    nullable: true,
    length: 255,
  })
  referrerAnchor: string | null;

  @Column('character varying', {
    name: 'referrerMedium',
    nullable: true,
    length: 255,
  })
  referrerMedium: string | null;

  @Column('character varying', {
    name: 'formAnalyticsUID',
    nullable: true,
    length: 255,
  })
  formAnalyticsUid: string | null;

  @Column('timestamp with time zone', { name: 'createdAt' })
  createdAt: Date;

  @Column('timestamp with time zone', { name: 'updatedAt' })
  updatedAt: Date;

  @Column('integer', { name: 'formAnalyticCompanyId', nullable: true })
  formAnalyticCompanyId: number | null;

  @Column('integer', { name: 'formAnalyticClientId', nullable: true })
  formAnalyticClientId: number | null;

  @Column('integer', { name: 'formAnalyticFormId', nullable: true })
  formAnalyticFormId: number;

  @Column('boolean', {
    name: 'zapFired',
    nullable: true,
    default: () => 'false',
  })
  zapFired: boolean | null;

  @ManyToOne(() => Forms, (forms) => forms.formAnalytics, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'formAnalyticFormId', referencedColumnName: 'id' }])
  form: Forms;

  @ManyToOne(() => Clients, (clients) => clients.formAnalytics, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'formAnalyticFormId', referencedColumnName: 'id' }])
  client: Clients;
}
