import { PropsWithChildren, useState } from 'react';
import { socketContext, useSocketProvider } from './useSocket';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const Inner = ({
  userName,
  ...props
}: PropsWithChildren<{ userName: string }>) => {
  const data = useSocketProvider({ userName });
  return <socketContext.Provider value={data} {...props} />;
};

const scheme = z.object({
  name: z.string().min(1),
});

export const SocketProvider = (props: PropsWithChildren) => {
  const [userName, setUserName] = useState<string>();
  const { register, handleSubmit } = useForm<z.infer<typeof scheme>>({
    resolver: zodResolver(scheme),
  });

  const onSubmit = (data: { name: string }) => {
    setUserName(data.name);
  };

  if (userName)
    return (
      <div className="flex flex-col min-h-screen">
        <div className="px-2 pt-1 flex justify-between ">
          <h1 className="text-lg font-bold">Welcome, {userName}</h1>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => {
              setUserName(undefined);
            }}
          >
            Leave
          </button>
        </div>
        <div className="flex-1 flex flex-col">
          <Inner userName={userName} {...props} />
        </div>
      </div>
    );

  return (
    <div className="grid place-items-center h-screen">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-4xl">Enter your information</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <input
            type="text"
            placeholder="User Name"
            className="p-2 border border-black rounded flex-1"
            {...register('name')}
          />
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Join
          </button>
        </form>
      </div>
    </div>
  );
};
