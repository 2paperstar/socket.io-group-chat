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

  const createRoom = useCallback((data: RoomCreation) => {
    sioRef.current?.emit('create', data, (room) =>
      setRooms((rooms) => [...rooms, room]),
    );
  }, []);

  const joinRoom = useCallback(async (id: string) => {
    sioRef.current?.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
    const result = await sioRef.current?.emitWithAck('join', id);
    if (!result) {
      return;
    }
    setMessages(result);
  }, []);

  const leaveRoom = useCallback(() => {
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
