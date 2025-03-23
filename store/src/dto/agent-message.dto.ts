import { z } from 'zod'

export const AccelerometerSchema = z
  .object({
    X: z.number(),
    Y: z.number(),
    Z: z.number(),
  })
  .strict()

export type AccelerometerDto = z.infer<typeof AccelerometerSchema>

export const GpsSchema = z
  .object({
    Lat: z.number(),
    Lng: z.number(),
  })
  .strict()
  
export type GpsDto = z.infer<typeof GpsSchema>

export const AgentMessageSchema = z
  .object({
    ClientId: z.string(),
    Accelerometer: AccelerometerSchema,
    Gps: GpsSchema,
    Time: z.string().datetime(),
    Speed: z.number(),
  })
  .strict()

export type AgentMessageDto = z.infer<typeof AgentMessageSchema>

export const HubMessageSchema = z
  .object({
    RoadState: z.string(),
    AgentMessage: AgentMessageSchema,
  })
  .strict()

export type HubMessageDto = z.infer<typeof HubMessageSchema>
    