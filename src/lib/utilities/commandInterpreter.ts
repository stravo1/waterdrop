import { get } from "svelte/store";
import {
  connectedDevices,
  currentTransferId,
  noOfToasts,
  receivingFileBufferList,
  receivingList,
  selectedFiles,
  sendingList,
} from "../store/store";
import { scroll, showToast } from "./misc";
import { toast } from "@zerodevx/svelte-toast";

const commandInterreter = (data: string, deviceID: string) => {
  var { command, action } = JSON.parse(data);

  switch (command) {
    case "info":
      var $deviceList = get(connectedDevices);
      $deviceList.set(deviceID, action);
      connectedDevices.set($deviceList);
      let name = action.name + " " + action.deviceType;
      var $number = get(noOfToasts);
      if ($number) {
        noOfToasts.update((n) => n + 1);
        setTimeout(() => {
          toast.pop(0);
          noOfToasts.update((n) => n - 1);
          showToast("Connected to " + name, "success");
        }, 1000);
      } else {
        noOfToasts.update((n) => n + 1);
        showToast("Connected to " + name, "success");
        setTimeout(() => {
          noOfToasts.update((n) => n - 1);
        }, 1000);
      }
      break;
    case "receiveReq":
      if (!get(selectedFiles).length) {
        scroll();
      }
      var { id, ...info } = action;
      console.log(id);

      var $receiveList = get(receivingList);
      $receiveList.set(id, info);
      receivingList.set($receiveList);

      var $receivingBuffers = get(receivingFileBufferList);
      $receivingBuffers.set(id, []);
      receivingFileBufferList.set($receivingBuffers);
      break;
    case "next-transfer":
      var transferID = action;
      currentTransferId.set(transferID);
      break;
    case "sentSize":
      var { id, size } = action;
      let $sendingList = get(sendingList);
      let requiredInfo = $sendingList.get(id);
      requiredInfo.sentSize = size;
      if (requiredInfo.sentSize >= requiredInfo.size) {
        showToast("File sent!", "success");
        setTimeout(() => {
          $sendingList.delete(id);
          sendingList.set($sendingList);
        }, 5000);
      } else {
        $sendingList.set(id, requiredInfo);
        sendingList.set($sendingList);
      }
      break;
    case "sending-complete":
      showToast("File Received!");

      var transferID = action;
      var $receivingBuffers = get(receivingFileBufferList);
      var $receiveList = get(receivingList);

      let buffer = $receivingBuffers.get(transferID);

      $receivingBuffers.delete(transferID);
      receivingFileBufferList.set($receivingBuffers);

      let blob = new Blob(buffer);
      let url = URL.createObjectURL(blob);
      var downloadInfo = $receiveList.get(transferID);
      downloadInfo.link = url;
      $receiveList.set(transferID, downloadInfo);
      receivingList.set($receiveList);

      break;
    default:
      console.log(action);
      break;
  }
};

export default commandInterreter;
