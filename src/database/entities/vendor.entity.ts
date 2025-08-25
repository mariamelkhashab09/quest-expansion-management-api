import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Country } from './country.entity';
import { Service } from './service.entity';

@Entity('vendor')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column({ type: 'int', name: 'response_sla_hours' })
  responseSlaHours: number;

  @ManyToMany(() => Country, (country) => country.vendors)
  @JoinTable({
    name: 'vendor_country',
    joinColumn: { name: 'vendor_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'country_id', referencedColumnName: 'id' }
  })
  countries: Country[];

  @ManyToMany(() => Service, (service) => service.vendors)
  @JoinTable({
    name: 'vendor_services',
    joinColumn: { name: 'vendor_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' }
  })
  services: Service[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}