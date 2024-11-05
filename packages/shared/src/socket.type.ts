export interface ServerToClientEvents {
  created: () => void;
}

export interface ClientToServerEvents {
  list: (cb: (data: any) => void) => void;
}
