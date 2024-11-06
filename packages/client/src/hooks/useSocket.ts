import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ClientToServerEvents,
  ListResponse,
  Message,
  RoomCreation,
  ServerToClientEvents,
} from 'shared';
import { io, Socket } from 'socket.io-client';

export const useSocketProvider = () => {
  const sioRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [rooms, setRooms] = useState<ListResponse>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const currentRoom = useRef<string | null>(null);

  useEffect(() => {
    const sio = io('http://localhost:3000');
    sioRef.current = sio;

    sio.on('connect', () => {
      sio.emit('list', setRooms);
      if (currentRoom.current) {
        sioRef.current?.emit('join', currentRoom.current, setMessages);
      }
    });
    sio.on('created', (room) => setRooms((rooms) => [...rooms, room]));

    return () => {
      sio.close();
    };
  }, []);

  const createRoom = useCallback((data: RoomCreation) => {
    sioRef.current?.emit('create', data, (room) =>
      setRooms((rooms) => [...rooms, room]),
    );
  }, []);

  const joinRoom = useCallback(async (id: string) => {
    currentRoom.current = id;
    sioRef.current?.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
    sioRef.current?.emit('join', id, setMessages);
  }, []);

  const leaveRoom = useCallback(() => {
    currentRoom.current = null;
    sioRef.current?.emit('leave');
    sioRef.current?.off('message');
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    sioRef.current?.emit('send', content, (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  return { rooms, createRoom, joinRoom, leaveRoom, messages, sendMessage };
};

export const socketContext = createContext<ReturnType<
  typeof useSocketProvider
> | null>(null);

export const useSocket = () => {
  const context = useContext(socketContext);

  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return context;
};
