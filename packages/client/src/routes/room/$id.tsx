import { createFileRoute } from '@tanstack/react-router';
import { useSocket } from '../../hooks/useSocket';
import { useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa6';
import { Message } from 'shared';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const useRoom = (id: string) => {
  const { joinRoom, leaveRoom, messages } = useSocket();

  useEffect(() => {
    joinRoom(id);
    return () => {
      leaveRoom();
    };
  }, [id]);

  return { id, messages };
};

const ChatBubble = (message: Message) => {
  return (
    <div className="flex gap-2">
      <div className="bg-blue-200 text-black py-1 px-2 rounded">
        {message.content}
      </div>
    </div>
  );
};

const scheme = z.object({
  content: z.string().trim().min(1),
});

const ChatRoomPage = () => {
  const { id } = Route.useParams();
  const { messages } = useRoom(id);
  const { register, handleSubmit, setValue } = useForm<z.infer<typeof scheme>>({
    resolver: zodResolver(scheme),
  });

  const onSend = handleSubmit((data) => {
    console.log(data);
    setValue('content', '');
  });

  return (
    <main className="flex min-h-screen flex-col p-2 gap-2 max-h-screen">
      <h1 className="text-2xl font-bold">Chat Room</h1>
      <div className="border border-black flex-1 p-2 flex flex-col gap-2 h-0">
        <div className="flex flex-1 flex-col-reverse border border-black p-2 gap-2 overflow-y-scroll">
          {messages.map((message) => (
            <ChatBubble key={message.id} {...message} />
          ))}
          <div className="self-center text-gray-400">
            - enter message below to send -
          </div>
        </div>
        <form className="flex border border-black p-2" onSubmit={onSend}>
          <input
            type="text"
            className="flex-1 outline-none"
            {...register('content')}
          />
          <button className="flex gap-2 items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <FaPaperPlane />
            Send
          </button>
        </form>
      </div>
    </main>
  );
};

export const Route = createFileRoute('/room/$id')({
  component: ChatRoomPage,
});
