import UAParser from "ua-parser-js";
import { toast } from "@zerodevx/svelte-toast";
import {
  connectedPeers,
  deviceInfo,
  myID,
  selectedFiles,
  sendingList,
} from "../store/store";
import Notification from "../components/Notification.svelte";
import { get } from "svelte/store";
import type Peer from "peer-lite";

const chunkSize = 16384;

function bytesToSize(bytes: number) {
  const sizes = ["bytes", "kb", "mb", "gb", "tb"];
  if (bytes === 0) return "n/a";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) return `${bytes}${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

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

const addTransferToSendingList = (deviceID: string, entry: File) => {
  let id = get(myID) + Math.round(new Date().getTime() * Math.random());
  var newSendingProgressInfo = {
    id: id,
    fileName: entry["name"],
    fileType: entry["type"].split("/")[0],
    size: entry["size"],
    lastTimeStamp: new Date().getTime(),
    ETA: -1,
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
    })
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
      JSON.stringify({ command: "next-transfer", action: id })
    );
    peerConnection.send(e.target.result);
    offset += e.target.result.byteLength;
    if (offset < file.size) {
      readSlice(offset, fileReader, file);
    } else {
      peerConnection.send(
        JSON.stringify({ command: "sending-complete", action: id })
      );
    }
  });
  readSlice(0, fileReader, file);
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

export { setDeviceInfo, showToast, sendFiles, scroll, bytesToSize };
