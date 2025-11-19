import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class IngestionService implements OnModuleInit {
    private client: mqtt.MqttClient;
    private readonly logger = new Logger(IngestionService.name);

    onModuleInit() {
        this.connectToMqtt();
    }

    private connectToMqtt() {
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
            // In a real app, parse and save to TimescaleDB
            this.logger.debug(`Received message on ${topic}: ${message.toString()}`);
        });
    }
}
