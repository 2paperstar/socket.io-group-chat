import { FaPlus, FaX } from 'react-icons/fa6';
import { useSocket } from '../hooks/useSocket';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const scheme = z.object({
  name: z.string(),
  description: z.string(),
});

export const CreateRoomButton = () => {
  const [showDialog, setShowDialog] = useState(false);
  const { createRoom } = useSocket();
  const { register, handleSubmit } = useForm<z.infer<typeof scheme>>({
    resolver: zodResolver(scheme),
  });

  const onSubmit = handleSubmit((data) => {
    createRoom(data);
    setShowDialog(false);
  });

  return (
    <>
      <button
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setShowDialog(true)}
      >
        <FaPlus />
        Create Room
      </button>
      {showDialog &&
        createPortal(
          <div className="fixed inset-0 bg-black/50">
            <div className="py-4 px-8 bg-white absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded flex flex-col gap-4 min-w-96">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Create Room</h2>
                <button onClick={() => setShowDialog(false)}>
                  <FaX />
                </button>
              </div>
              <form className="flex flex-col gap-2" onSubmit={onSubmit}>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Name"
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
                <input
                  {...register('description')}
                  type="text"
                  placeholder="Description"
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 self-end">
                  Create
                </button>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
