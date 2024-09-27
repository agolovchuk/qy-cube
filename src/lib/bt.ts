import type { Communicator, EventHandler } from "./types";

export interface BTEventTarget {
  value: {
    buffer: Buffer;
  };
}

export class BT implements Communicator {
  #uuids?: BluetoothServiceUUID[];
  #prefix?: string;
  #id?: string;
  #name?: string;
  private device?: BluetoothDevice;
  private service?: BluetoothRemoteGATTService;
  private readonly onDisconnect: EventHandler;

  /**
   *
   * @param uuid Service UUID
   * @param prefix Prefix of the device name
   */
  constructor(onDisconnect: EventHandler) {
    this.onDisconnect = onDisconnect;
  }

  set uuids(uuids: BluetoothServiceUUID[]) {
    this.#uuids = uuids;
  }

  set prefix(prefix: string) {
    this.#prefix = prefix;
  }

  private set id(id: string) {
    this.#id = id;
  }

  get id() {
    if (typeof this.#id === "undefined")
      throw new Error("At first you need to init device");
    return this.#id;
  }

  private set name(name: string) {
    this.#name = name;
  }

  get name() {
    if (typeof this.#name === "undefined")
      throw new Error("At first you need to init device");
    return this.#name;
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

  private async getService(
    uuid: BluetoothServiceUUID
  ): Promise<BluetoothRemoteGATTService> {
    const server = await this.getServer();
    this.service = await server.getPrimaryService(uuid);
    return this.service;
  }

  async getCharacteristic(uuid: BluetoothCharacteristicUUID) {
    if (typeof this.service === "undefined")
      throw new Error("At first you have to init service");
    return this.service.getCharacteristic(uuid);
  }

  private async onDisconnectSubscribe(onDisconnect: EventHandler) {
    this.getDevice().addEventListener(
      "gattserverdisconnected",
      function (this: BluetoothDevice) {
        onDisconnect(undefined);
      }
    );
  }

  async onMessageSubscribe(
    uuids: [BluetoothServiceUUID, BluetoothCharacteristicUUID],
    onMessage: EventHandler<Uint8Array>
  ) {
    await this.getService(uuids[0]);
    const characteristic = await this.getCharacteristic(uuids[1]);
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

  async init() {
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: this.#prefix }],
      optionalServices: this.#uuids,
    });
    this.#id = this.device.id;
    this.#name = this.device.name;
    this.onDisconnectSubscribe(this.onDisconnect);
  }

  async send(value: Uint8Array, uuid: BluetoothCharacteristicUUID) {
    const characteristic = await this.getCharacteristic(uuid);
    await characteristic.writeValue(value);
  }

  async read(uuid: BluetoothCharacteristicUUID) {
    const characteristic = await this.getCharacteristic(uuid);
    return characteristic.readValue();
  }

  disconnect() {
    this.getDevice().gatt?.disconnect();
  }
}
