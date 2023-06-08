import UAParser from "ua-parser-js";
import { toast } from "@zerodevx/svelte-toast";
import {
  connectedPeers,
  deviceInfo,
  historyPageOpen,
  historyPageSection,
  modalMessage,
  myID,
  selectedFiles,
  sendingList,
  sheetVisible,
  textInput,
} from "../store/store";
import Notification from "../components/Notification.svelte";
import { get } from "svelte/store";
import type Peer from "peer-lite";
import Emitter from "component-emitter";

const chunkSize = 16384;
const SENDING_CHANNEL = "send";
const emitter = new Emitter();

/* --- misc useful functions --- */
function bytesToSize(bytes: number) {
  const sizes = ["bytes", "kb", "mb", "gb", "tb"];
  if (bytes === 0) return "n/a";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) return `${bytes}${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(0)} ${sizes[i]}`;
}

async function fetchWithTimeout(resource: string) {
  const timeout = 10000;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

/* --- app initializer functions ---*/
const getWorkingURL = async () => {
  let URL = localStorage.getItem("url");
  if (!URL) {
    // no URL was saved
    localStorage.setItem("url", "https://waterdrop-server.glitch.me");
    URL = "https://waterdrop-server.glitch.me";
    return URL;
  }
  modalMessage.set("Connecting to server");

  try {
    // test if local server is functional
    await fetchWithTimeout(URL);
    return URL;
  } catch (error) {
    showToast("Local server unavailable!", "warning");
    modalMessage.set("Trying public servers");
    try {
      // probe glitch server
      await fetch("https://waterdrop-server.glitch.me");
      return "https://waterdrop-server.glitch.me";
    } catch (error) {
      // last option
      return "https://waterdrop-sqxs.onrender.com";
    }
  }
};

const setDeviceInfo = () => {
  let info = new UAParser(navigator.userAgent);
  let deviceName = info.getBrowser()["name"];
  let platform = info.getOS()["name"];
  let type = info.getDevice()["type"] ? info.getDevice()["type"] : "desktop";

  let result = {
    name: deviceName,
    platform: platform,
    deviceType: type,
    own: true,
  };

  deviceInfo.set(result);
  return result;
};

/* --- functions used by components --- */
const showToast = (message: string, type: string = "misc") => {
  toast.push({
    component: {
      src: Notification,
      props: { message: message, type: type },
    },
    dismissable: false,
    duration: 1000,
    initial: 1,
    intro: { y: -100 },
  });
};

const sendFiles = (deviceID: string) => {
  historyPageOpen.set(true);
  historyPageSection.set("sent");
  var $list = get(selectedFiles);
  selectedFiles.set([]);
  $list.forEach(async (entry) => {
    let transactionReq = addTransferToSendingList(deviceID, entry);
    let peer = sendTransactionReq(deviceID, transactionReq);
    sendFileData(peer, entry, transactionReq.id);
  });
};

/* --- helper functions for the sendFiles function --- */

const addTransferToSendingList = (deviceID: string, entry: File) => {
  let id = get(myID) + Math.round(new Date().getTime() * Math.random());
  var newSendingProgressInfo = {
    id: id,
    fileName: entry["name"],
    fileType: entry["type"].split("/")[0],
    size: entry["size"],
  };

  var $temp = get(sendingList);

  $temp.set(id, { ...newSendingProgressInfo, to: deviceID, sentSize: 0 });
  sendingList.set($temp);
  return newSendingProgressInfo;
};

const sendTransactionReq = (deviceID: string, transactionReq: any) => {
  let $peers = get(connectedPeers);
  let $reqPeer = $peers.get(deviceID);
  $reqPeer.send(
    JSON.stringify({
      command: "receiveReq",
      action: {
        ...transactionReq,
        from: get(myID),
        receivedSize: 0,
      },
    }),
    SENDING_CHANNEL
  );
  return $reqPeer;
};

const readSlice = (offset: number, buffer: ArrayBuffer, peer: Peer) => {
  const chunk = buffer.slice(offset, offset + chunkSize);
  const dataChannel = peer.getDataChannel(SENDING_CHANNEL);
  if (dataChannel.bufferedAmount > dataChannel.bufferedAmountLowThreshold) {
    dataChannel.onbufferedamountlow = () => {
      dataChannel.onbufferedamountlow = null;
      emitter.emit("load", { chunk: chunk });
    };
    return;
  }
  emitter.emit("load", { chunk: chunk });
};

const sendFileData = async (peerConnection: Peer, file: File, id: string) => {
  let offset = 0;
  var buffer = await file.arrayBuffer();
  emitter.on("load", (e) => {
    peerConnection.send(
      JSON.stringify({ command: "next-transfer", action: id }),
      SENDING_CHANNEL
    );
    peerConnection.send(e.chunk, SENDING_CHANNEL);
    offset += e.chunk.byteLength;
    if (offset < file.size) {
      readSlice(offset, buffer, peerConnection);
    } else {
      peerConnection.send(
        JSON.stringify({ command: "sending-complete", action: id }),
        SENDING_CHANNEL
      );
    }
  });
  readSlice(0, buffer, peerConnection);
};

const sendText = (deviceID: string) => {
  let peer = get(connectedPeers).get(deviceID);
  peer.send(
    JSON.stringify({ command: "text-transfer", action: get(textInput) }),
    SENDING_CHANNEL
  );
  showToast("Text sent!", "success");
  textInput.set("");
  sheetVisible.set(false);
};

/* --- check for direct shares to the PWA --- */
const checkShare = async () => {
  const trigger = await caches.open("trigger");

  let keys = await trigger.keys();
  if (!keys.length) {
    return;
  }
  caches.delete("trigger");
  caches.open("add").then((cache) => {
    cache.keys().then((requests) => {
      requests.forEach(async (request) => {
        var response = await cache.match(request);
        if (response.headers.get("content-type") == "text/plain") {
          response.text().then((txt) => textInput.set(txt));
          cache.delete(request);
        } else {
          let blob = await response.blob();
          let file = new File(
            [blob],
            decodeURIComponent(request.url.replace(/https:\/\/*\//, "")),
            {
              type: response.headers.get("content-type"),
            }
          );
          let $selectedFiles = get(selectedFiles);
          $selectedFiles.push(file);
          selectedFiles.set($selectedFiles);
          cache.delete(request);
        }
      });
    });
  });
  sheetVisible.set(true);
};

export {
  setDeviceInfo,
  showToast,
  sendFiles,
  sendText,
  bytesToSize,
  getWorkingURL,
  checkShare,
};
