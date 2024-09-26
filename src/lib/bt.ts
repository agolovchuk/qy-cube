import type { Communicator, EventHandler } from "./types";
import { MAC } from "./constants";

const MAIN_SERVICE_UUID = 0xfff0;
const MAIN_CHARACTERISTIC_UUID = 0xfff6;
const QY_CUBE_PREFIX = "QY-QYSC";

export interface BTEventTarget {
  value: {
    buffer: Buffer;
  };
}

export class BT implements Communicator {
  readonly uuid: string | number;
  readonly prefix: string;
  private device?: BluetoothDevice;

  /**
   *
   * @param uuid Service UUID
   * @param prefix Prefix of the device name
   */
  constructor(
    uuid: number | string = MAIN_SERVICE_UUID,
    prefix: string = QY_CUBE_PREFIX
  ) {
    this.uuid = uuid;
    this.prefix = prefix;
  }

  private getDevice(): BluetoothDevice {
    if (!this.device) throw new Error("Device is not initialize");
    return this.device;
  }

  private async getServer() {
    const server = await this.getDevice().gatt?.connect();
    if (!server) throw new Error("No Server found");
    return server;
  }

  private async getService() {
    const server = await this.getServer();
    return server.getPrimaryService(this.uuid);
  }

  private async getCharacteristic(
    uuid: number | string = MAIN_CHARACTERISTIC_UUID
  ) {
    const service = await this.getService();
    return service.getCharacteristic(uuid);
  }

  private async onDisconnectSubscribe(onDisconnect: EventHandler) {
    this.getDevice().addEventListener(
      "gattserverdisconnected",
      function (this: BluetoothDevice, event: Event) {
        //TODO: Disconnected
        console.log(this, event);
        onDisconnect(undefined);
      }
    );
  }

  private async onMessageSubscribe(
    onMessage: EventHandler<Uint8Array>,
    uuid?: number | string
  ) {
    const characteristic = await this.getCharacteristic(uuid);
    await characteristic.startNotifications();

    characteristic.addEventListener(
      "characteristicvaluechanged",
      function (this: BluetoothRemoteGATTCharacteristic) {
        if (this.value?.buffer) {
          onMessage(new Uint8Array(this.value?.buffer));
        }
      }
    );
  }

  async init(onDisconnect: EventHandler, onMessage: EventHandler<Uint8Array>) {
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: this.prefix }],
      optionalServices: [this.uuid],
    });

    this.onDisconnectSubscribe(onDisconnect);
    this.onMessageSubscribe(onMessage);
  }

  async send(value: Uint8Array, uuid?: number | string) {
    const characteristic = await this.getCharacteristic(uuid);
    await characteristic.writeValue(value);
  }

  async read(uuid?: number | string) {
    const characteristic = await this.getCharacteristic(uuid);
    return characteristic.readValue();
  }

  get mac() {
    return MAC;
  }

  disconnect() {
    this.getDevice().gatt?.disconnect();
  }
}
