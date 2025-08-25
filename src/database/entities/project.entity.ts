import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Client } from './client.entity';
import { Country } from './country.entity';
import { ProjectStatus } from './project-status.entity';
import { Service } from './service.entity';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'country_id' })
  countryId: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  budget: number;

  @Column({ name: 'status_id' })
  statusId: number;

  @ManyToOne(() => Client, (client) => client.projects)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Country, (country) => country.projects)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => ProjectStatus, (status) => status.projects)
  @JoinColumn({ name: 'status_id' })
  status: ProjectStatus;

  @ManyToMany(() => Service, (service) => service.projects)
  @JoinTable({
    name: 'project_services',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' }
  })
  services: Service[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}