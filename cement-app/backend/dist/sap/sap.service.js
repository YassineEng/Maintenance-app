"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SapService = void 0;
const common_1 = require("@nestjs/common");
const http_client_1 = require("@sap-cloud-sdk/http-client");
let SapService = SapService_1 = class SapService {
    constructor() {
        this.logger = new common_1.Logger(SapService_1.name);
        this.destination = {
            url: process.env.SAP_URL || 'https://sandbox.api.sap.com/s4hanacloud',
            authentication: 'BasicAuthentication',
            username: process.env.SAP_USERNAME,
            password: process.env.SAP_PASSWORD,
        };
    }
    async getEquipmentList() {
        try {
            this.logger.log('Fetching equipment list from SAP...');
            const response = await (0, http_client_1.executeHttpRequest)(this.destination, {
                method: http_client_1.HttpMethod.GET,
                url: '/sap/opu/odata/sap/API_EQUIPMENT/Equipment',
                params: {
                    '$top': 100,
                    '$format': 'json'
                }
            });
            return response.data.d.results;
        }
        catch (error) {
            this.logger.error('Failed to fetch equipment', error);
            throw error;
        }
    }
    async getWorkOrders(equipmentId) {
        try {
            this.logger.log(`Fetching work orders for equipment ${equipmentId}...`);
            const response = await (0, http_client_1.executeHttpRequest)(this.destination, {
                method: http_client_1.HttpMethod.GET,
                url: '/sap/opu/odata/sap/API_MAINTENANCEORDER/MaintenanceOrder',
                params: {
                    '$filter': `Equipment eq '${equipmentId}'`,
                    '$top': 20,
                    '$format': 'json'
                }
            });
            return response.data.d.results;
        }
        catch (error) {
            this.logger.error(`Failed to fetch work orders for ${equipmentId}`, error);
            throw error;
        }
    }
    async createWorkOrder(orderData) {
        try {
            this.logger.log('Creating maintenance order in SAP...');
            const response = await (0, http_client_1.executeHttpRequest)(this.destination, {
                method: http_client_1.HttpMethod.POST,
                url: '/sap/opu/odata/sap/API_MAINTENANCEORDER/MaintenanceOrder',
                data: orderData,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': 'Fetch'
                }
            });
            return response.data;
        }
        catch (error) {
            this.logger.error('Failed to create work order', error);
            throw error;
        }
    }
};
exports.SapService = SapService;
exports.SapService = SapService = SapService_1 = __decorate([
    (0, common_1.Injectable)()
], SapService);
//# sourceMappingURL=sap.service.js.map