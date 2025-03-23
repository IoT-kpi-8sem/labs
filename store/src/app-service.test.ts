import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { DbClient } from './db/prisma-client';
import { AgentMessageDto, HubMessageDto } from './dto/agent-message.dto';

describe('AppService', () => {
  let service: AppService;
  const dbClientMock = {
    agentMessage: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: '123' }),
      update: jest.fn().mockResolvedValue({ id: '123' }),
      delete: jest.fn().mockResolvedValue({ id: '123' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: DbClient,
          useValue: dbClientMock,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should retrieve all agent messages', async () => {
    const result = await service.getAll();

    expect(dbClientMock.agentMessage.findMany).toHaveBeenCalled();

    expect(result).toEqual([]);
  });

  it('should retrieve an agent message by ID', async () => {
    dbClientMock.agentMessage.findUnique.mockResolvedValueOnce({ id: '123' });

    const result = await service.getById('123');

    expect(dbClientMock.agentMessage.findUnique).toHaveBeenCalledWith({ where: { id: '123' } });
    expect(result).toEqual({ id: '123' });
  });

  it('should create a new agent message', async () => {
    const dto: HubMessageDto = {
      AgentMessage: {
        Gps: { Lat: 1, Lng: 2 },
        Accelerometer: { X: 1, Y: 2, Z: 3 },
        ClientId: 'client1',
        Time: new Date().toISOString(),
        Speed: 50,
      },
      RoadState: 'Good',
    };

    const result = await service.create(dto);

    expect(dbClientMock.agentMessage.create).toHaveBeenCalled();
    expect(result).toEqual({ id: '123' });
  });

  it('should update an agent message', async () => {
    dbClientMock.agentMessage.update.mockResolvedValueOnce({ id: 'updated' });
    const partial: Partial<AgentMessageDto> = { Gps: { Lat: 1, Lng: 2 } };

    const result = await service.update('123', partial);

    expect(dbClientMock.agentMessage.update).toHaveBeenCalledWith({
      where: { id: '123' },
      data: partial,
    });
    expect(result).toEqual({ id: 'updated' });
  });

  it('should delete an agent message', async () => {
    dbClientMock.agentMessage.delete.mockResolvedValueOnce({ id: 'deleted' });

    const result = await service.delete('123');

    expect(dbClientMock.agentMessage.delete).toHaveBeenCalledWith({ where: { id: '123' } });
    expect(result).toEqual({ id: 'deleted' });
  });

  it('should fail to retrieve a non-existing agent message', async () => {
    dbClientMock.agentMessage.findUnique.mockResolvedValueOnce(null);

    const result = await service.getById('nonexistent');

    expect(result).toBeNull();
  });

  it('should fail if create operation is rejected by the database', async () => {
    dbClientMock.agentMessage.create.mockRejectedValueOnce(new Error('DB create error'));
    const dto: HubMessageDto = {
      AgentMessage: {
        Gps: { Lat: 1, Lng: 2 },
        Accelerometer: { X: 1, Y: 2, Z: 3 },
        ClientId: 'client1',
        Time: new Date().toISOString(),
        Speed: 50,
      },
      RoadState: 'Bad',
    };

    await expect(service.create(dto)).rejects.toThrowError('DB create error');
  });

  it('should fail if update operation is rejected by the database', async () => {
    dbClientMock.agentMessage.update.mockRejectedValueOnce(new Error('DB update error'));

    await expect(service.update('123', { Gps: { Lat: 1, Lng: 2 } })).rejects.toThrowError('DB update error');
  });

  it('should fail if delete operation is rejected by the database', async () => {
    dbClientMock.agentMessage.delete.mockRejectedValueOnce(new Error('DB delete error'));
    
    await expect(service.delete('123')).rejects.toThrowError('DB delete error');
  });
});