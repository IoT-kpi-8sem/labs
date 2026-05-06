import { Injectable, OnModuleInit } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"
import { MetricsService } from "../metrics/metrics.service"

@Injectable()
export class DbClient extends PrismaClient implements OnModuleInit {
  constructor(private readonly metrics: MetricsService) {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })
  }

  async onModuleInit() {
    this.$use(async (params, next) => {
      const start = process.hrtime.bigint()
      const model = params.model ?? 'raw'
      const action = params.action
      try {
        const result = await next(params)
        const elapsed = Number(process.hrtime.bigint() - start) / 1e9
        this.metrics.dbQueryDuration.observe({ model, action }, elapsed)
        this.metrics.dbQueriesTotal.inc({ model, action, status: 'ok' })
        return result
      } catch (err) {
        const elapsed = Number(process.hrtime.bigint() - start) / 1e9
        this.metrics.dbQueryDuration.observe({ model, action }, elapsed)
        this.metrics.dbQueriesTotal.inc({ model, action, status: 'error' })
        throw err
      }
    })

    await this.$connect()
  }
}
