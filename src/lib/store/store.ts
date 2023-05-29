import type Peer from "peer-lite";
import { writable } from "svelte/store";

type id = string;

interface deviceInfo {
  name: string;
  platform: string;
  deviceType: string;
  own: boolean;
}

interface progressInfo {
  fileName: string;
  fileType: string;
  size: number;
}
interface sendingProgressInfo extends progressInfo {
  to: id;
  sentSize: number;
}
interface receivingProgressInfo extends progressInfo {
  from: id;
  receivedSize: number;
}

export const otherDevicesInRoom = writable<id[]>([]);
export const initallyConnectedDevices = writable<id[]>([]);
export const connectedDevices = writable<Map<id, deviceInfo>>(new Map());
export const connectedPeers = writable<Map<id, Peer>>(new Map());

export const sendingList = writable<Map<id, sendingProgressInfo>>(new Map());
export const receivingList = writable<Map<id, receivingProgressInfo>>(
  new Map()
);

export const receivingFileBufferList = writable<
  Map<id, (ArrayBuffer | ArrayBufferView | Blob)[]>
>(new Map());
