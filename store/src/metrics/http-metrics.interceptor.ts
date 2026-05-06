import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { MetricsService } from './metrics.service';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const req = http.getRequest<{ method: string; route?: { path: string }; originalUrl?: string }>();
    const res = http.getResponse<{ statusCode: number }>();
    const start = process.hrtime.bigint();

    const finalize = (statusOverride?: number) => {
      const elapsed = Number(process.hrtime.bigint() - start) / 1e9;
      const route = req.route?.path ?? req.originalUrl ?? 'unknown';
      const method = req.method ?? 'UNKNOWN';
      const status = String(statusOverride ?? res.statusCode ?? 0);
      this.metrics.httpRequestsTotal.inc({ method, route, status });
      this.metrics.httpRequestDuration.observe({ method, route, status }, elapsed);
    };

    return next.handle().pipe(
      tap({
        next: () => finalize(),
        error: (err: { status?: number }) => finalize(err?.status ?? 500),
      }),
    );
  }
}
