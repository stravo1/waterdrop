import UAParser from "ua-parser-js";
import { toast } from "@zerodevx/svelte-toast";
import {
  connectedPeers,
  deviceInfo,
  modalMessage,
  myID,
  selectedFiles,
  sendingList,
} from "../store/store";
import Notification from "../components/Notification.svelte";
import { get } from "svelte/store";
import type Peer from "peer-lite";

const chunkSize = 16384;
const SENDING_CHANNEL = "send";

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

const scroll = () => {
  var main = document.getElementsByTagName("main")[0];
  main.scrollTop = main.scrollHeight;
};

const sendFiles = (deviceID: string) => {
  scroll();
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

const readSlice = (offset: number, fileReader: FileReader, file: File) => {
  const slice = file.slice(offset, offset + chunkSize);
  fileReader.readAsArrayBuffer(slice);
};

const sendFileData = (peerConnection: Peer, file: File, id: string) => {
  let offset = 0;
  var fileReader = new FileReader();
  fileReader.addEventListener("error", (error) =>
    console.error("Error reading file:", error)
  );
  fileReader.addEventListener("abort", (event) =>
    console.log("File reading aborted:", event)
  );
  fileReader.addEventListener("load", async (e) => {
    if (typeof e.target.result === "string") return; // to validate the next line
    /* IM A FUCKIN GENIOUS */
    peerConnection.send(
      JSON.stringify({ command: "next-transfer", action: id }),
      SENDING_CHANNEL
    );
    peerConnection.send(e.target.result, SENDING_CHANNEL);
    offset += e.target.result.byteLength;
    if (offset < file.size) {
      readSlice(offset, fileReader, file);
    } else {
      peerConnection.send(
        JSON.stringify({ command: "sending-complete", action: id }),
        SENDING_CHANNEL
      );
    }
  });
  readSlice(0, fileReader, file);
};

export {
  setDeviceInfo,
  showToast,
  sendFiles,
  scroll,
  bytesToSize,
  getWorkingURL,
};
