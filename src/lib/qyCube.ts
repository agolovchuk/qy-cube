import { encrypt, decrypt, padMessageToBlockSize } from "./aes128";
import { createPacket, u8toArray } from "./helpers";
import { parseMessage } from "./parser";
import type { Communicator, EventHandler, CubeMessage } from "./types";

export class QYCube {
  private readonly communicator: Communicator;
  private readonly onDisconnect: EventHandler;
  private readonly onMessage: EventHandler<CubeMessage>;

  constructor(
    communicator: Communicator,
    onDisconnect: EventHandler,
    onMessage: EventHandler<CubeMessage>
  ) {
    this.communicator = communicator;
    this.onDisconnect = onDisconnect;
    this.onMessage = onMessage;
  }

  private createMessage(data: Uint8Array, mac?: Uint8Array): Uint8Array {
    const preparedMessage = padMessageToBlockSize(createPacket(data, mac));
    console.log("Message created: ", u8toArray(preparedMessage));
    return encrypt(preparedMessage);
  }

  private messageHandler = (data: Uint8Array) => {
    const message = parseMessage(decrypt(data));
    console.log("Message received:", message);
    this.onMessage(message);
    if (message.isASCRequire) {
      const asc = new Uint8Array(5);
      asc[0] = message.type;
      asc.set(message.timestamp, 1);
      this.communicator.send(this.createMessage(asc));
    }
  };

  async init() {
    await this.communicator.init(this.onDisconnect, this.messageHandler);
    await this.communicator.send(
      this.createMessage(new Uint8Array(11), this.communicator.mac)
    );
  }

  disconnect() {
    this.communicator.disconnect();
  }
}
