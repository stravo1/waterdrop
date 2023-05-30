import Peer from "peer-lite";
import type { Socket } from "socket.io-client";
import { get } from "svelte/store";
import {
  connectedDevices,
  connectedPeers,
  currentTransferId,
  deviceInfo,
  initallyConnectedDevices,
  receivingFileBufferList,
  receivingList,
} from "../store/store";
import commandInterreter from "./commandInterpreter";
import { showToast } from "./misc";

const chunkSize = 16384;

const SEND_SIGNALLING_OFFER = "transfer-offer";
const SEND_SIGNALLING_ANSWER = "transfer-answer";
const SEND_ICE_CANDIDATES = "transfer-ice";

const sendOffer = (
  socket: Socket,
  from: string,
  to: string,
  data: RTCSessionDescriptionInit
) => {
  socket.emit(SEND_SIGNALLING_OFFER, from, to, data);
};

const sendAnswer = (
  socket: Socket,
  from: string,
  to: string,
  data: RTCSessionDescriptionInit
) => {
  socket.emit(SEND_SIGNALLING_ANSWER, from, to, data);
};

const sendICEcandidates = (
  socket: Socket,
  from: string,
  to: string,
  candidates: RTCIceCandidate[]
) => {
  socket.emit(SEND_ICE_CANDIDATES, from, to, candidates);
};

const addDeviceToConnectedList = (deviceID: string) => {
  var $temp = get(initallyConnectedDevices);
  $temp.push(deviceID);
  initallyConnectedDevices.set($temp);
};

const addPeerToConnectedList = (deviceID: string, peer: Peer) => {
  var $temp = get(connectedPeers);
  $temp.set(deviceID, peer);
  connectedPeers.set($temp);
};

const removeDeviceFromConnectedList = (deviceID: string) => {
  var $initialDevices = get(initallyConnectedDevices);
  var $connectedPeers = get(connectedPeers);
  var $connectedDevices = get(connectedDevices);
  var info = $connectedDevices.get(deviceID);
  try{
    showToast("Disconnected from " + info.name + " " + info.deviceType, "error");
  } catch {
    console.log("Error");
    
  }
    $initialDevices.splice($initialDevices.indexOf(deviceID), 1);
  $connectedPeers.delete(deviceID);
  $connectedDevices.delete(deviceID);
  initallyConnectedDevices.set($initialDevices);
  connectedPeers.set($connectedPeers);
  connectedDevices.set($connectedDevices);
};

const handleData = (
  peer: Peer,
  deviceID: string,
  source: "outgoing" | "incoming",
  data: string | ArrayBufferView | ArrayBuffer | Blob
) => {
  if (source === "outgoing") {
    return;
  }

  if (typeof data === "string") {
    commandInterreter(data, deviceID);
  } else {
    var $fileBuffers = get(receivingFileBufferList);
    var $receivingProgresses = get(receivingList);

    // var currentlyReceiving = [...$fileBuffers.keys()];

    // var requiredID = currentlyReceiving.filter((transferID) =>
    //   transferID.includes(deviceID)
    // );
    //console.log(requiredID[0]);
    var requiredID = get(currentTransferId);

    var fileBuffer = $fileBuffers.get(requiredID);
    fileBuffer.push(data);
    $fileBuffers.set(requiredID, fileBuffer);
    receivingFileBufferList.set($fileBuffers);

    var receivingInfo = $receivingProgresses.get(requiredID);
    receivingInfo.receivedSize += chunkSize;

    receivingInfo.receivedSize >= receivingInfo.size
      ? (receivingInfo.receivedSize = receivingInfo.size)
      : null;

    $receivingProgresses.set(requiredID, receivingInfo);
    receivingList.set($receivingProgresses);

    peer.send(
      JSON.stringify({
        command: "sentSize",
        action: { id: requiredID, size: receivingInfo.receivedSize },
      })
    );
    //console.log((receivingInfo.receivedSize / receivingInfo.size) * 100);
  }
};

const createOfferingPeer = async (deviceID: string, socket: Socket) => {
  const peer = new Peer({ enableDataChannels: true, channelLabel: "data" });

  peer.on("signal", (data) => {
    sendOffer(socket, socket.id, deviceID, data);
  });

  peer.on("onicecandidates", (data) => {
    sendICEcandidates(socket, socket.id, deviceID, data);
  });

  peer.on("connected", () => {
    addDeviceToConnectedList(deviceID);
    setTimeout(() => {
      peer.send(JSON.stringify({ command: "info", action: get(deviceInfo) }));
    }, 100);
  });

  peer.on("disconnected", () => {
    removeDeviceFromConnectedList(deviceID);
  });
  peer.on("channelClosed", () => {
    removeDeviceFromConnectedList(deviceID);
  });

  peer.on("channelData", ({ channel, source, data }) => {
    handleData(peer, deviceID, source, data);
  });

  peer.start();
  addPeerToConnectedList(deviceID, peer);
};

const createAnsweringPeer = async (deviceID: string, socket: Socket) => {
  const peer = new Peer({ enableDataChannels: true, channelLabel: "data" });

  peer.on("signal", (data) => {
    sendAnswer(socket, socket.id, deviceID, data);
  });

  peer.on("onicecandidates", (data) => {
    sendICEcandidates(socket, socket.id, deviceID, data);
  });

  peer.on("connected", () => {
    addDeviceToConnectedList(deviceID);
    setTimeout(() => {
      peer.send(JSON.stringify({ command: "info", action: get(deviceInfo) }));
    }, 100);
  });

  peer.on("disconnected", () => {
    removeDeviceFromConnectedList(deviceID);
  });
  peer.on("channelClosed", () => {
    removeDeviceFromConnectedList(deviceID);
  });

  peer.on("channelData", ({ channel, source, data }) => {
    handleData(peer, deviceID, source, data);
  });
  addPeerToConnectedList(deviceID, peer);
};

export { createOfferingPeer, createAnsweringPeer };
