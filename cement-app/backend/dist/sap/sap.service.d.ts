export declare class SapService {
    private readonly logger;
    private readonly destination;
    getEquipmentList(): Promise<any>;
    getWorkOrders(equipmentId: string): Promise<any>;
    createWorkOrder(orderData: any): Promise<any>;
}
