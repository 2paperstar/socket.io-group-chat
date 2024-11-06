import { createFileRoute } from '@tanstack/react-router';
import { useSocket } from '../../hooks/useSocket';
import { useEffect } from 'react';

const useRoom = (id: string) => {
  const { joinRoom, leaveRoom } = useSocket();

  useEffect(() => {
    joinRoom(id);
    return () => {
      leaveRoom();
    };
  }, [id]);

  return { id };
};

const ChatRoomPage = () => {
  const { id } = Route.useParams();
  useRoom(id);

  return (
    <main className="flex min-h-screen flex-col p-2 gap-2">
      <h1 className="text-2xl font-bold">Chat Room</h1>
    </main>
  );
};

export const Route = createFileRoute('/room/$id')({
  component: ChatRoomPage,
});
