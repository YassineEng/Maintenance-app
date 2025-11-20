import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Equipment } from './entities/equipment.entity';
import { WorkOrder } from './entities/work-order.entity';
import { Workflow } from './entities/workflow.entity';
import { SapModule } from './sap/sap.module';
import { ScriptModule } from './script/script.module';
import { FileModule } from './file/file.module';
import { GeminiModule } from './gemini/gemini.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        // TypeOrmModule.forRoot({
        //     type: 'postgres',
        //     host: process.env.DB_HOST || 'localhost',
        //     port: 5432,
        //     username: process.env.DB_USER || 'postgres',
        //     password: process.env.DB_PASSWORD || 'postgres',
        //     database: process.env.DB_NAME || 'cement_app',
        //     entities: [Equipment, WorkOrder, Workflow],
        //     synchronize: true, // Disable in production
        // }),
        SapModule,
        ScriptModule,
        FileModule,
        GeminiModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
