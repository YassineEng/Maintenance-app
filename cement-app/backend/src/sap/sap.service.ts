import { Injectable, Logger } from '@nestjs/common';
import { executeHttpRequest, HttpMethod } from '@sap-cloud-sdk/http-client';

@Injectable()
export class SapService {
    private readonly logger = new Logger(SapService.name);

    // Configuration for the destination (defined in SAP BTP or env vars)
    private readonly destination = {
        url: process.env.SAP_URL || 'https://sandbox.api.sap.com/s4hanacloud',
        authentication: 'BasicAuthentication',
        username: process.env.SAP_USERNAME,
        password: process.env.SAP_PASSWORD,
    };

    async getEquipmentList() {
        try {
            this.logger.log('Fetching equipment list from SAP...');
            const response = await executeHttpRequest(this.destination, {
                method: HttpMethod.GET,
                url: '/sap/opu/odata/sap/API_EQUIPMENT/Equipment',
                params: {
                    '$top': 100,
                    '$format': 'json'
                }
            });
            return response.data.d.results;
        } catch (error) {
            this.logger.error('Failed to fetch equipment', error);
            throw error;
        }
    }

    async getWorkOrders(equipmentId: string) {
        try {
            this.logger.log(`Fetching work orders for equipment ${equipmentId}...`);
            const response = await executeHttpRequest(this.destination, {
                method: HttpMethod.GET,
                url: '/sap/opu/odata/sap/API_MAINTENANCEORDER/MaintenanceOrder',
                params: {
                    '$filter': `Equipment eq '${equipmentId}'`,
                    '$top': 20,
                    '$format': 'json'
                }
            });
            return response.data.d.results;
        } catch (error) {
            this.logger.error(`Failed to fetch work orders for ${equipmentId}`, error);
            throw error;
        }
    }

    async createWorkOrder(orderData: any) {
        try {
            this.logger.log('Creating maintenance order in SAP...');
            const response = await executeHttpRequest(this.destination, {
                method: HttpMethod.POST,
                url: '/sap/opu/odata/sap/API_MAINTENANCEORDER/MaintenanceOrder',
                data: orderData,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': 'Fetch' // SDK handles token fetching automatically usually, but explicit fetch might be needed in some cases
                }
            });
            return response.data;
        } catch (error) {
            this.logger.error('Failed to create work order', error);
            throw error;
        }
    }
}
