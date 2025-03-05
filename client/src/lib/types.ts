import { X } from "lucide-react"
import { z } from "zod"

export const AccelerometerDto = z
  .object({
    X: z.number(),
    Y: z.number(),
    Z: z.number(),
  })
  .strict()

export type AccelerometerDto = z.infer<typeof AccelerometerDto>

export const GpsDto = z
  .object({
    Lat: z.number(),
    Lng: z.number(),
  })
  .strict()

export type GpsDto = z.infer<typeof GpsDto>

export const AgentMessageDto = z
  .object({
    clientId: z.string(),
    accelerometer: AccelerometerDto,
    gps: GpsDto,
    time: z.string().datetime(),
    roadState: z.string(),
  })
  .strict()

export type AgentMessageDto = z.infer<typeof AgentMessageDto>

