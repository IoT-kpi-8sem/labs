import { useEffect, useState } from 'react';
import { type Socket, io } from 'socket.io-client';
import { AgentMessageDto } from './lib/types';
import MapComponent from './components/map-component';
import MessageList from './components/message-list';

export default function Home() {
  const [, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<AgentMessageDto[]>([]);
  const [actualClientsData, setActualClientsData] = useState<AgentMessageDto[]>(
    []
  );
  const [isConnected, setIsConnected] = useState(false);

  const handleSetActualClientsData = (newData: AgentMessageDto) => {
    setActualClientsData((prevData) => {
      const index = prevData.findIndex(
        (data) => data.clientId === newData.clientId
      );

      if (index === -1) {
        return [...prevData, newData];
      }

      const updatedData = [...prevData];
      updatedData[index] = newData;
      return updatedData;
    });
  };

  useEffect(() => {
    const socketInstance = io('ws://localhost:3000');

    socketInstance.on('connect', () => {
      setIsConnected(true);

      socketInstance.emit('all');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('all-messages', (allMessages: AgentMessageDto[]) => {
      console.log(allMessages);
      setMessages(allMessages);
    });

    socketInstance.on('message-created', (newMessage: AgentMessageDto) => {
      console.log(newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      handleSetActualClientsData(newMessage);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <main className='container mx-auto p-4 h-screen'>
      <h1 className='text-xl font-bold mb-4'>Real-time Agent Tracking</h1>
      <div className='flex flex-col gap-5 h-full'>
        <div className='w-full'>
          <div className='p-4 border rounded-lg bg-card'>
            <h2 className='text-xl font-semibold mb-2'>Map View</h2>
            <div className='connection-status mb-2'>
              Status:{' '}
              {isConnected ? (
                <span className='text-green-500'>Connected</span>
              ) : (
                <span className='text-red-500'>Disconnected</span>
              )}
            </div>
            <MapComponent
              actualClientsData={actualClientsData}
              allMessages={messages}
            />
          </div>
        </div>

        <div className='w-full flex-1 flex flex-col p-4 border rounded-lg bg-card'>
          <h2 className='text-xl font-semibold mb-2'>Recent Messages</h2>
          <MessageList messages={messages} />
        </div>
      </div>
    </main>
  );
}
