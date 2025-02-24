import { z } from 'zod'

export const AccelerometerDto = z
  .object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  })
  .strict()

export type AccelerometerDto = z.infer<typeof AccelerometerDto>

export const GpsDto = z
  .object({
    latitude: z.number(),
    longitude: z.number(),
  })
  .strict()
  
export type GpsDto = z.infer<typeof GpsDto>

export const AgentMessageDto = z
  .object({
    clientId: z.string(),
    accelerometer: AccelerometerDto,
    gps: GpsDto,
    time: z.string().datetime()
  })
  .strict()

export type AgentMessageDto = z.infer<typeof AgentMessageDto>