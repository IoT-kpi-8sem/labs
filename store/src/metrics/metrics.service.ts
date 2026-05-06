import { Injectable } from '@nestjs/common';
import {
  Counter,
  Gauge,
  Histogram,
  Registry,
  collectDefaultMetrics,
} from 'prom-client';

@Injectable()
export class MetricsService {
  readonly registry = new Registry();

  readonly roadQualityTotal = new Counter({
    name: 'road_quality_messages_total',
    help: 'Total agent messages classified by road state',
    labelNames: ['road_state', 'client_id'],
    registers: [this.registry],
  });

  readonly vehicleSpeed = new Gauge({
    name: 'vehicle_speed_kmh',
    help: 'Last reported vehicle speed (km/h)',
    labelNames: ['client_id'],
    registers: [this.registry],
  });

  readonly recommendedSpeed = new Gauge({
    name: 'recommended_speed_kmh',
    help: 'Recommended speed (km/h) derived from road state',
    labelNames: ['client_id', 'road_state'],
    registers: [this.registry],
  });

  readonly speedHistogram = new Histogram({
    name: 'vehicle_speed_distribution_kmh',
    help: 'Distribution of reported vehicle speeds',
    labelNames: ['road_state'],
    buckets: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150],
    registers: [this.registry],
  });

  readonly speedDeltaHistogram = new Histogram({
    name: 'vehicle_speed_over_recommended_kmh',
    help: 'How much actual speed exceeds recommended speed (km/h, negative=under)',
    labelNames: ['road_state'],
    buckets: [-50, -25, -10, -5, 0, 5, 10, 25, 50, 100],
    registers: [this.registry],
  });

  readonly httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'HTTP requests received by the Store API',
    labelNames: ['method', 'route', 'status'],
    registers: [this.registry],
  });

  readonly httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Latency of HTTP requests handled by the Store API',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
    registers: [this.registry],
  });

  readonly dbQueryDuration = new Histogram({
    name: 'db_query_duration_seconds',
    help: 'Prisma query latency by model and action',
    labelNames: ['model', 'action'],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2],
    registers: [this.registry],
  });

  readonly dbQueriesTotal = new Counter({
    name: 'db_queries_total',
    help: 'Prisma queries executed by model and action',
    labelNames: ['model', 'action', 'status'],
    registers: [this.registry],
  });

  readonly wsConnections = new Gauge({
    name: 'websocket_connections',
    help: 'Active Socket.IO client connections',
    registers: [this.registry],
  });

  readonly wsMessagesTotal = new Counter({
    name: 'websocket_messages_total',
    help: 'Socket.IO messages by event and direction',
    labelNames: ['event', 'direction'],
    registers: [this.registry],
  });

  constructor() {
    collectDefaultMetrics({ register: this.registry, prefix: 'store_' });
  }

  observeMessage(roadState: string | null, clientId: string, speed: number, recommended: number) {
    const state = roadState ?? 'unknown';
    this.roadQualityTotal.inc({ road_state: state, client_id: clientId });
    this.vehicleSpeed.set({ client_id: clientId }, speed);
    this.recommendedSpeed.set({ client_id: clientId, road_state: state }, recommended);
    this.speedHistogram.observe({ road_state: state }, speed);
    this.speedDeltaHistogram.observe({ road_state: state }, speed - recommended);
  }
}
