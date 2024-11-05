import { useEffect, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import {
  ClientToServerEvents,
  ListResponse,
  ServerToClientEvents,
} from 'shared';
import { io, Socket } from 'socket.io-client';

function App() {
  const sioRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [rooms, setRooms] = useState<ListResponse>([]);

  useEffect(() => {
    const sio = io('http://localhost:3000');
    sioRef.current = sio;

    sio.on('connect', () => {
      sio.emit('list', setRooms);
    });
    sio.on('created', (room) => setRooms((rooms) => [...rooms, room]));

    return () => {
      sio.close();
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col p-2 gap-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Group Chat</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {}}
        >
          <FaPlus />
          Create Room
        </button>
      </div>
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
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {}}
            >
              Join
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
