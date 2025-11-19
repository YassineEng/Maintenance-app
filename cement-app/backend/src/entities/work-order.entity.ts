import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Equipment } from './equipment.entity';

@Entity()
export class WorkOrder {
    @PrimaryColumn()
    id: string; // SAP Order Number (AUFNR)

    @Column()
    orderType: string; // SAP Order Type (AUART)

    @Column()
    description: string; // Short Text (KTEXT)

    @Column({ nullable: true })
    status: string; // System Status

    @Column({ type: 'timestamp', nullable: true })
    basicStartDate: Date; // GSTRP

    @Column({ type: 'timestamp', nullable: true })
    basicEndDate: Date; // GLTRP

    @ManyToOne(() => Equipment, { nullable: true })
    equipment: Equipment;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
