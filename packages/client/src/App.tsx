import { CreateRoomButton } from './components/CreateRoomButton';
import { useSocket } from './hooks/useSocket';

function App() {
  const { rooms } = useSocket();

  return (
    <main className="flex min-h-screen flex-col p-2 gap-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Group Chat</h1>
        <CreateRoomButton />
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
