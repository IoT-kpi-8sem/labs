import { AccelerometerSchema, GpsSchema, AgentMessageSchema, HubMessageSchema } from './agent-message.dto';

describe('Zod Schemas', () => {
  describe('GpsSchema', () => {
    it('should parse valid GPS data', () => {
      const validGps = { Lat: 50.45, Lng: 30.52 };

      const result = GpsSchema.safeParse(validGps);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validGps);
      }
    });

    it('should fail on invalid GPS data', () => {
      const invalidGps = { Lat: 'not-a-number', Lng: null };

      const result = GpsSchema.safeParse(invalidGps);

      expect(result.success).toBe(false);
    });
  });

  describe('AccelerometerSchema', () => {
    it('should parse valid accelerometer data', () => {
      const validAccel = { X: 0.1, Y: 0.2, Z: 0.3 };

      const result = AccelerometerSchema.safeParse(validAccel);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validAccel);
      }
    });

    it('should fail on invalid accelerometer data', () => {
      const invalidAccel = { X: 'x', Y: 'y', Z: 10 };

      const result = AccelerometerSchema.safeParse(invalidAccel);

      expect(result.success).toBe(false);
    });
  });

  describe('AgentMessageSchema', () => {
    it('should parse valid agent message data', () => {
      const validAgentMsg = {
        ClientId: 'client1',
        Accelerometer: { X: 1, Y: 2, Z: 3 },
        Gps: { Lat: 12.34, Lng: 56.78 },
        Time: new Date().toISOString(),
        Speed: 50,
      };

      const result = AgentMessageSchema.safeParse(validAgentMsg);

      expect(result.success).toBe(true);
    });

    it('should fail on invalid agent message data', () => {
      const invalidAgentMsg = {
        ClientId: 123, // should be a string
        Accelerometer: { X: 1, Y: 2, Z: 3 },
        Gps: { Lat: 12.34, Lng: 56.78 },
        Time: 'invalid-date',
        Speed: 'fast',
      };

      const result = AgentMessageSchema.safeParse(invalidAgentMsg);

      expect(result.success).toBe(false);
    });
  });

  describe('HubMessageSchema', () => {
    it('should parse valid hub message data', () => {
      const validHubMsg = {
        RoadState: 'Good',
        AgentMessage: {
          ClientId: 'client1',
          Accelerometer: { X: 1, Y: 2, Z: 3 },
          Gps: { Lat: 12.34, Lng: 56.78 },
          Time: new Date().toISOString(),
          Speed: 40,
        },
      };

      const result = HubMessageSchema.safeParse(validHubMsg);

      expect(result.success).toBe(true);
    });

    it('should fail if RoadState is missing', () => {
      const invalidHubMsg = {
        AgentMessage: {
          ClientId: 'client1',
          Accelerometer: { X: 1, Y: 2, Z: 3 },
          Gps: { Lat: 12.34, Lng: 56.78 },
          Time: new Date().toISOString(),
          Speed: 40,
        },
      };

      const result = HubMessageSchema.safeParse(invalidHubMsg);
      
      expect(result.success).toBe(false);
    });
  });
});