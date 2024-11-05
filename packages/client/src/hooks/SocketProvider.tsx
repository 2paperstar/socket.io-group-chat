import { PropsWithChildren } from 'react';
import { socketContext, useSocketProvider } from './useSocket';

export const SocketProvider = (props: PropsWithChildren) => {
  const data = useSocketProvider();
  return <socketContext.Provider value={data} {...props} />;
};
