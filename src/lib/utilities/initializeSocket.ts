import { io } from "socket.io-client";
import {
  connected,
  connectedPeers,
  deviceInfo,
  modalMessage,
  modalVisible,
  myID,
  otherDevicesInRoom,
  sameDeviceAlreadyInRoomErrorModalVisible,
  workingURL,
} from "../store/store";
import { get } from "svelte/store";
import { createAnsweringPeer, createOfferingPeer } from "./peerMaker";
import { showToast } from "./misc";

const JOINING_ROOM = "room-members";
const NEW_MEMBER_IN_ROOM = "new-room-member";
const MEMBER_LEAVING_ROOM = "remove-room-member";

const RECEIVE_SIGNALLING_OFFER = "receive-offer";
const RECEIVE_SIGNALLING_ANSWER = "receive-answer";
const RECEIVE_ICE_CANDIDATES = "receive-ice";

const SAME_DEVICE_ALREADY_IN_ROOM_ERROR = "same-device";

const addDeviceToList = (deviceID: string) => {
  var $temp = get(otherDevicesInRoom);
  $temp.push(deviceID);
  otherDevicesInRoom.set($temp);
};

const removeDeviceFromList = (deviceID: string) => {
  var $temp = get(otherDevicesInRoom);
  $temp.splice($temp.indexOf(deviceID), 1);
  otherDevicesInRoom.set($temp);
};

const addSignallingData = async (
  deviceID: string,
  data: RTCSessionDescriptionInit
) => {
  var $allPeers = get(connectedPeers);
  var peer = $allPeers.get(deviceID);
  await peer.signal(data);
};

const addICEcandidates = async (
  deviceID: string,
  candidates: RTCIceCandidate[]
) => {
  var $allPeers = get(connectedPeers);
  var peer = $allPeers.get(deviceID);
  const promises = candidates.map(async (candidate) =>
    peer.addIceCandidate(candidate)
  );
  await Promise.all(promises);
};

const initializeSocket = (forced: "forced" | null = null) => {
  modalVisible.set(true);
  let deviceName = get(deviceInfo).name;
  let URL = get(workingURL);

  const socket = io(URL, {
    auth: { deviceName: deviceName, forced: forced == "forced" ? true : false },
  });

  socket.on(JOINING_ROOM, (devicesAlreadyInRoom: string[]) => {
    modalMessage.set("Connecting to nearby devices");
    devicesAlreadyInRoom.forEach((deviceID) => {
      if (deviceID != socket.id) {
        addDeviceToList(deviceID);
        createOfferingPeer(deviceID, socket);
      }
    });
    modalVisible.set(false);
  });

  socket.on(NEW_MEMBER_IN_ROOM, (deviceID: string) => {
    if (deviceID != socket.id) {
      addDeviceToList(deviceID);
      createAnsweringPeer(deviceID, socket);
    }
  });

  socket.on(MEMBER_LEAVING_ROOM, (deviceID: string) => {
    removeDeviceFromList(deviceID);
  });

  socket.on(
    RECEIVE_SIGNALLING_OFFER,
    async (from: string, data: RTCSessionDescriptionInit) => {
      addSignallingData(from, data);
    }
  );

  socket.on(
    RECEIVE_SIGNALLING_ANSWER,
    async (from: string, data: RTCSessionDescriptionInit) => {
      addSignallingData(from, data);
    }
  );

  socket.on(
    RECEIVE_ICE_CANDIDATES,
    async (from: string, iceCandidates: RTCIceCandidate[]) => {
      addICEcandidates(from, iceCandidates);
    }
  );

  socket.on("connect", () => {
    connected.set(true);
    myID.set(socket.id);
    console.log("Connected to server: " + socket.id);
  });

  socket.on("disconnect", () => {
    showToast("Disconnected from server", "error");
  });

  socket.on("reconnect", () => {
    showToast("Reconnecting to server", "warning");
  });

  socket.on("connect_error", (err) => {
    if (err.message == SAME_DEVICE_ALREADY_IN_ROOM_ERROR) {
      sameDeviceAlreadyInRoomErrorModalVisible.set(true);
    }
  });
  return socket;
};

export default initializeSocket;
