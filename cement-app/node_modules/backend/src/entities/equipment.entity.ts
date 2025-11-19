import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Equipment {
    @PrimaryColumn()
    id: string; // SAP Equipment Number (EQUNR)

    @Column()
    name: string; // SAP Description (EQKTX)

    @Column({ nullable: true })
    functionalLocation: string; // SAP Functional Location (TPLNR)

    @Column({ nullable: true })
    plannerGroup: string; // SAP Planner Group (INGRP)

    @Column({ type: 'jsonb', default: {} })
    metadata: Record<string, any>; // Extra SAP fields

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
