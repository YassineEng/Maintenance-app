import { OnModuleInit } from '@nestjs/common';
export declare class IngestionService implements OnModuleInit {
    private client;
    private readonly logger;
    onModuleInit(): void;
    private connectToMqtt;
}
