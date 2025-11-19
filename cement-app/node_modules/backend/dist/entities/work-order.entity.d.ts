import { Equipment } from './equipment.entity';
export declare class WorkOrder {
    id: string;
    orderType: string;
    description: string;
    status: string;
    basicStartDate: Date;
    basicEndDate: Date;
    equipment: Equipment;
    createdAt: Date;
    updatedAt: Date;
}
