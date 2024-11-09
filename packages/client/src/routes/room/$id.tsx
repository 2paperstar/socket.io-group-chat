import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaPaperPlane } from 'react-icons/fa6';
import { z } from 'zod';
import { useSocket } from '../../hooks/useSocket';
import { MessageOnServer } from 'shared';

const useRoom = (id: string) => {
  const { joinRoom, leaveRoom, messages, sendMessage } = useSocket();

  useEffect(() => {
    joinRoom(id);
    return () => {
      leaveRoom();
    };
  }, [id]);

  return {
    id,
    messages,
    sendMessage,
  };
};

const ChatBubble = (message: MessageOnServer) => {
  return (
    <div className={`flex gap-2` + (message.isMe ? ' justify-end' : '')}>
      <div className="bg-blue-200 text-black py-1 px-2 rounded">
        {message.isMe
          ? message.content
          : `${message.userName}: ${message.content}`}
      </div>
    </div>
  );
};

const scheme = z.object({
  content: z.string().trim().min(1),
});

const ChatRoomPage = () => {
  const { id } = Route.useParams();
  const { messages, sendMessage } = useRoom(id);
  const { register, handleSubmit, setValue } = useForm<z.infer<typeof scheme>>({
    resolver: zodResolver(scheme),
  });

  const onSend = handleSubmit((data) => {
    sendMessage(data.content);
    setValue('content', '');
  });

  return (
    <main className="flex flex-col p-2 gap-2 flex-1 h-0">
      <div className="border border-black flex-1 p-2 flex flex-col gap-2 h-0">
        <div className="flex flex-1 flex-col-reverse border border-black p-2 gap-2 overflow-y-scroll">
          {messages
            .toReversed()
            .map((message) =>
              message.type === 'joined' ? (
                <div className="self-center text-gray-400">
                  - '{message.userName}' joined -
                </div>
              ) : message.type === 'left' ? (
                <div className="self-center text-gray-400">
                  - '{message.userName}' left -
                </div>
              ) : (
                <ChatBubble key={message.id} {...message} />
              ),
            )}
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
