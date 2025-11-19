"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var IngestionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionService = void 0;
const common_1 = require("@nestjs/common");
const mqtt = require("mqtt");
let IngestionService = IngestionService_1 = class IngestionService {
    constructor() {
        this.logger = new common_1.Logger(IngestionService_1.name);
    }
    onModuleInit() {
        this.connectToMqtt();
    }
    connectToMqtt() {
        this.client = mqtt.connect(process.env.MQTT_URL || 'mqtt://localhost:1883');
        this.client.on('connect', () => {
            this.logger.log('Connected to MQTT Broker');
            this.client.subscribe('sensors/#', (err) => {
                if (err) {
                    this.logger.error('Failed to subscribe', err);
                }
            });
        });
        this.client.on('message', (topic, message) => {
            this.logger.debug(`Received message on ${topic}: ${message.toString()}`);
        });
    }
};
exports.IngestionService = IngestionService;
exports.IngestionService = IngestionService = IngestionService_1 = __decorate([
    (0, common_1.Injectable)()
], IngestionService);
//# sourceMappingURL=ingestion.service.js.map