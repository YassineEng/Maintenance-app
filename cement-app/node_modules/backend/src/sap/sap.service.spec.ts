import { Test, TestingModule } from '@nestjs/testing';
import { SapService } from './sap.service';
import { executeHttpRequest } from '@sap-cloud-sdk/http-client';

jest.mock('@sap-cloud-sdk/http-client');

describe('SapService', () => {
    let service: SapService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SapService],
        }).compile();

        service = module.get<SapService>(SapService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should fetch equipment list', async () => {
        const mockResponse = { data: { d: { results: [{ Equipment: '1001' }] } } };
        (executeHttpRequest as jest.Mock).mockResolvedValue(mockResponse);

        const result = await service.getEquipmentList();
        expect(result).toEqual([{ Equipment: '1001' }]);
        expect(executeHttpRequest).toHaveBeenCalled();
    });
});
