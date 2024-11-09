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
  MessageOnServer,
  RoomCreation,
  ServerToClientEvents,
  SocketData,
} from 'shared';
import { io, Socket } from 'socket.io-client';

type MessageOrEvent =
  | (MessageOnServer & { type: 'message' })
  | (({ type: 'joined' } | { type: 'left' }) & SocketData);

export const useSocketProvider = ({ userName }: { userName: string }) => {
  const sioRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [rooms, setRooms] = useState<ListResponse>([]);
  const [messages, setMessages] = useState<MessageOrEvent[]>([]);
  const currentRoom = useRef<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const sio = io('http://localhost:3000', { query: { userName } });
    sioRef.current = sio;

    sio.on('connect', () => {
      setUserId(sio.id ?? null);
      sio.emit('list', setRooms);
      if (currentRoom.current) {
        sioRef.current?.emit('join', currentRoom.current, (ms) =>
          setMessages(ms.map((v) => ({ ...v, type: 'message' }))),
        );
      }
    });
    sio.on('created', (room) => setRooms((rooms) => [...rooms, room]));

    return () => {
      sio.close();
      setUserId(null);
    };
  }, []);

  const createRoom = useCallback((data: RoomCreation) => {
    sioRef.current?.emit('create', data, (room) =>
      setRooms((rooms) => [...rooms, room]),
    );
  }, []);

  const joinRoom = useCallback(async (id: string) => {
    currentRoom.current = id;
    sioRef.current?.on('message', (message) =>
      setMessages((messages) => [...messages, { ...message, type: 'message' }]),
    );
    sioRef.current?.on('joined', (user) =>
      setMessages((messages) => [...messages, { type: 'joined', ...user }]),
    );
    sioRef.current?.on('left', (user) =>
      setMessages((messages) => [...messages, { type: 'left', ...user }]),
    );
    sioRef.current?.emit('join', id, (ms) =>
      setMessages(ms.map((v) => ({ ...v, type: 'message' }))),
    );
  }, []);

  const leaveRoom = useCallback(() => {
    currentRoom.current = null;
    sioRef.current?.emit('leave');
    sioRef.current?.off('message');
    sioRef.current?.off('joined');
    sioRef.current?.off('left');
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    sioRef.current?.emit('send', content, (message) =>
      setMessages((messages) => [...messages, { ...message, type: 'message' }]),
    );
  }, []);

  return {
    rooms,
    createRoom,
    joinRoom,
    leaveRoom,
    messages,
    sendMessage,
    userId,
    userName,
  };
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
