import type Peer from "peer-lite";
import { derived, writable } from "svelte/store";

/* TODO: put interfaces in separate files and use them in other places */
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
  id: string;
}
interface sendingProgressInfo extends progressInfo {
  to: id;
  sentSize: number;
}
interface receivingProgressInfo extends progressInfo {
  from: id;
  receivedSize: number;
  link?: string;
}

interface receivedTextModalContent {
  name: string;
  text: string;
}

export const noOfToasts = writable<number>(0);

export const modalMessage = writable<string>("Loading");
export const modalVisible = writable<boolean>(true);

export const sheetVisible = writable<boolean>(false);

export const sameDeviceAlreadyInRoomErrorModalVisible =
  writable<boolean>(false);

export const receivedTextModalVisible = writable<boolean>(false);
export const receivedTextModalContent = writable<receivedTextModalContent>({
  name: "",
  text: "",
});

export const settingsPageOpen = writable<boolean>(false);

export const historyPageOpen = writable<boolean>(false);
export const historyPageSection = writable<"sent" | "received">("sent");

export const selectedFiles = writable<File[]>([]);
export const textInput = writable<string>();

export const connected = writable<boolean>(false);
export const workingURL = writable<string>();
export const myID = writable<string>();
export const deviceInfo = writable<deviceInfo>();

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

export const currentTransferId = writable<string>();

/* --- for maintaining a linear async transfer queue --- */
export const transferQueueID = writable<string[]>([]);
export const transferQueueFile = writable<Map<id, File>>(new Map());
export const transferQueuePeer = writable<Map<id, Peer>>(new Map());
export const transferDeQueueingActive = writable<boolean>(false);

/* --- derived readale store items for displaying progress in History page --- */
export const currentlySending = derived(sendingList, ($enrty) => {
  var newMap: Map<id, sendingProgressInfo> = new Map();
  $enrty.forEach((sendingInfo, id) => {
    if (sendingInfo.sentSize > 0) {
      newMap.set(id, sendingInfo);
    }
  });
  return newMap;
});

/* redundant code alert weewwww  weeeeeww */
export const currentlyReceiving = derived(receivingList, ($enrty) => {
  var newMap: Map<id, receivingProgressInfo> = new Map();
  $enrty.forEach((receivingInfo, id) => {
    if (receivingInfo.receivedSize > 0) {
      newMap.set(id, receivingInfo);
    }
  });
  return newMap;
});

export const sendingQueue = derived(sendingList, ($enrty) => {
  var newMap: Map<id, sendingProgressInfo> = new Map();
  $enrty.forEach((sendingInfo, id) => {
    if (sendingInfo.sentSize === 0) {
      newMap.set(id, sendingInfo);
    }
  });
  return newMap;
});

export const receivingQueue = derived(receivingList, ($enrty) => {
  var newMap: Map<id, receivingProgressInfo> = new Map();
  $enrty.forEach((receivingInfo, id) => {
    if (receivingInfo.receivedSize === 0) {
      newMap.set(id, receivingInfo);
    }
  });
  return newMap;
});

export const sentList = derived(sendingList, ($enrty) => {
  var newMap: Map<id, sendingProgressInfo> = new Map();
  $enrty.forEach((sendingInfo, id) => {
    if (sendingInfo.sentSize >= sendingInfo.size) {
      newMap.set(id, sendingInfo);
    }
  });
  return newMap;
});

export const receivedList = derived(receivingList, ($enrty) => {
  var newMap: Map<id, receivingProgressInfo> = new Map();
  $enrty.forEach((receivingInfo, id) => {
    if (receivingInfo.receivedSize >= receivingInfo.size) {
      newMap.set(id, receivingInfo);
    }
  });
  return newMap;
});
