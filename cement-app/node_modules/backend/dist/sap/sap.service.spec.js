"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const sap_service_1 = require("./sap.service");
const http_client_1 = require("@sap-cloud-sdk/http-client");
jest.mock('@sap-cloud-sdk/http-client');
describe('SapService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [sap_service_1.SapService],
        }).compile();
        service = module.get(sap_service_1.SapService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should fetch equipment list', async () => {
        const mockResponse = { data: { d: { results: [{ Equipment: '1001' }] } } };
        http_client_1.executeHttpRequest.mockResolvedValue(mockResponse);
        const result = await service.getEquipmentList();
        expect(result).toEqual([{ Equipment: '1001' }]);
        expect(http_client_1.executeHttpRequest).toHaveBeenCalled();
    });
});
//# sourceMappingURL=sap.service.spec.js.map