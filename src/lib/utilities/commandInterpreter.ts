import { get } from "svelte/store";
import { connectedDevices, noOfToasts } from "../store/store";
import { showToast } from "./misc";
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

    default:
      break;
  }
};

export default commandInterreter;
