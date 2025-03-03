import { Virtuoso } from 'react-virtuoso';
import type { AgentMessageDto } from '@/lib/types';

interface MessageListProps {
  messages: AgentMessageDto[];
}

export default function MessageList({ messages }: MessageListProps) {
  // Sort messages by time, newest first
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  if (sortedMessages.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        No messages received yet
      </div>
    );
  }

  return (
    <div className='flex-1'>
      <Virtuoso
        style={{ width: '100%', height: '100%' }}
        data={sortedMessages}
        itemContent={(_, message) => (
          <li
            key={`${message.gps.Lng} ${message.gps.Lat}`}
            className='p-3 border-b last:border-b-0'
          >
            <div className='flex justify-between'>
              <span className='font-medium'>Client: {message.clientId}</span>
              <span className='text-xs text-muted-foreground'>
                {new Date(message.time).toLocaleString()}
              </span>
            </div>
            <div className='mt-1 text-sm'>
              <div>
                GPS: {message.gps.Lat.toFixed(6)},{' '}
                {message.gps.Lng.toFixed(6)}
              </div>
              <div className='text-xs text-muted-foreground'>
                Accelerometer: x={message.accelerometer.X.toFixed(2)}, y=
                {message.accelerometer.Y.toFixed(2)}, z=
                {message.accelerometer.Z.toFixed(2)}
              </div>
            </div>
          </li>
        )}
      />
    </div>
  );
}
