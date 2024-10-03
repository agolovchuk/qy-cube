import { crc16ModBus } from "./crc16";
import { createPacket } from "./QYCube/helpers";
import { padMessageToBlockSize, decrypt, encrypt } from "./aes128";
import { APP_HELLO, MAC, KEY } from "./mock";

const hello = new Uint8Array([
  254, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 249, 252, 0, 0, 163, 204, 21, 8, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]);
const encryptedHello = new Uint8Array([
  143, 91, 4, 8, 206, 157, 154, 192, 63, 224, 15, 132, 201, 233, 189, 184, 36,
  57, 232, 35, 236, 75, 170, 86, 60, 152, 168, 171, 54, 83, 60, 175,
]);

test("Should return correct checksum", () => {
  const data = [0xfe, 0x09, 0x02, 0x00, 0x02, 0x45, 0x2c];
  const message = new Uint8Array(data);
  expect(crc16ModBus(message)).toEqual(0x1bef);
});

test("Should create hello message", () => {
  expect(createPacket(APP_HELLO, MAC)).toEqual(
    new Uint8Array([
      0xfe, 0x15, 0x00, 0x6b, 0x01, 0x00, 0x00, 0x22, 0x06, 0x00, 0x02, 0x08,
      0x00, 0xf9, 0xfc, 0x00, 0x00, 0xa3, 0xcc, 0xc5, 0x21,
    ])
  );
});

test("Should create padded message", () => {
  const helloPacket = createPacket(APP_HELLO, MAC);
  const paddedMessage = padMessageToBlockSize(helloPacket);
  const result = new Uint8Array([
    0xfe, 0x15, 0x00, 0x6b, 0x01, 0x00, 0x00, 0x22, 0x06, 0x00, 0x02, 0x08,
    0x00, 0xf9, 0xfc, 0x00, 0x00, 0xa3, 0xcc, 0xc5, 0x21, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  ]);
  expect(paddedMessage).toEqual(result);
});

test("Should encrypt message", () => {
  const helloPacket = createPacket(APP_HELLO, MAC);
  const paddedMessage = padMessageToBlockSize(helloPacket);
  const encMessage = encrypt(KEY, paddedMessage);
  expect(encMessage.length).toBe(paddedMessage.length);
});

test("Should encrypt correctly", () => {
  const helloPacket = createPacket(new Uint8Array(11), MAC);
  const paddedMessage = padMessageToBlockSize(helloPacket);
  expect(paddedMessage).toEqual(hello);
  expect(encrypt(KEY, paddedMessage)).toEqual(encryptedHello);
});

test("Should be encrypt and decrypt correctly", () => {
  const helloPacket = createPacket(APP_HELLO, MAC);
  const paddedMessage = padMessageToBlockSize(helloPacket);
  const eMessage = encrypt(KEY, paddedMessage);
  expect(decrypt(KEY, eMessage)).toEqual(paddedMessage);
});
