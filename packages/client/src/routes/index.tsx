import { createFileRoute, Link } from '@tanstack/react-router';
import { useSocket } from '../hooks/useSocket';
import { CreateRoomButton } from '../components/CreateRoomButton';

const ListPage = () => {
  const { rooms } = useSocket();

  return (
    <main className="flex flex-1 flex-col p-2 gap-2">
      <div className="border border-black flex-1">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="p-2 border-b border-gray-300 flex justify-between items-center"
          >
            <div className="flex flex-col">
              <div className="text-lg">{room.name}</div>
              <div className="text-slate-600">{room.description}</div>
            </div>
            <Link to={`/room/${room.id}`}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Join
              </button>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-end items-center">
        <CreateRoomButton />
      </div>
    </main>
  );
};

export const Route = createFileRoute('/')({
  component: ListPage,
});
