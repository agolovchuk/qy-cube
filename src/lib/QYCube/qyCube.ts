import { encrypt, decrypt, padMessageToBlockSize } from "../aes128";
import { createPacket } from "./helpers";
import { parseMessage } from "./parser";
import type { Communicator, EventHandler } from "../types";
import type { CubeMessage } from "./types";

const MAIN_SERVICE_UUID = 0xfff0;
const MAIN_CHARACTERISTIC_UUID = 0xfff6;
const QY_CUBE_PREFIX = "QY-QYSC";
const MAC_MANUFACTURE = [0xcc, 0xa3, 0x00, 0x00];

export class QYCube {
  private readonly communicator: Communicator;
  private readonly onMessage: EventHandler<CubeMessage>;
  #mac?: Uint8Array;

  constructor(
    communicator: Communicator,
    onMessage: EventHandler<CubeMessage>
  ) {
    this.communicator = communicator;
    this.communicator.uuids = [MAIN_SERVICE_UUID];
    this.communicator.prefix = QY_CUBE_PREFIX;
    this.onMessage = onMessage;
  }

  private createMessage(data: Uint8Array, mac?: Uint8Array): Uint8Array {
    const preparedMessage = padMessageToBlockSize(createPacket(data, mac));
    return encrypt(preparedMessage);
  }

  private messageHandler = (data: Uint8Array) => {
    const message = parseMessage(decrypt(data));
    this.onMessage(message);
    if (message.isASCRequire) {
      const asc = new Uint8Array(5);
      asc[0] = message.type;
      asc.set(message.timestamp, 1);
      this.communicator.send(this.createMessage(asc), MAIN_CHARACTERISTIC_UUID);
    }
  };

  private set mac(name: string) {
    const postfix = name
      .trim()
      .slice(-4)
      .match(/.{1,2}/g);
    if (Array.isArray(postfix)) {
      const deviceMacPostfix = postfix.map((e) => parseInt(e, 16));
      this.#mac = new Uint8Array(MAC_MANUFACTURE.concat(deviceMacPostfix));
    }
  }

  private get mac(): Uint8Array {
    if (typeof this.#mac === "undefined") throw new Error("No mac initialized");
    return this.#mac;
  }

  async init() {
    await this.communicator.init();
    this.mac = this.communicator.name;
    await this.communicator.onMessageSubscribe(
      [MAIN_SERVICE_UUID, MAIN_CHARACTERISTIC_UUID],
      this.messageHandler
    );
    await this.communicator.send(
      this.createMessage(new Uint8Array(11), this.mac),
      MAIN_CHARACTERISTIC_UUID
    );
  }

  disconnect() {
    this.communicator.disconnect();
  }
}
