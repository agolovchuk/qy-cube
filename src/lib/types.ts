export type EventHandler<T = undefined> = (data: T) => void;

export type UUID = string | number;

export interface Communicator {
  onMessageSubscribe(
    uuids: [UUID, UUID],
    fn: EventHandler<Uint8Array>
  ): Promise<void>;
  send(data: Uint8Array, uuid: UUID): Promise<void>;
  init(): Promise<void>;
  disconnect(): void;
  set uuids(uuids: UUID[]);
  set prefix(prefix: string);
  get id(): string;
  get name(): string;
}
