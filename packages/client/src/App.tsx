import { useEffect } from 'react';
import { ClientToServerEvents, ServerToClientEvents } from 'shared';
import { io, Socket } from 'socket.io-client';

function App() {
  useEffect(() => {
    const sio: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      'http://localhost:3000',
    );

    sio.emit('list', console.log);
    sio.on('created', () => {});
    return () => {
      sio.close();
    };
  }, []);

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
