import UAParser from "ua-parser-js";
import { toast } from "@zerodevx/svelte-toast";
import { deviceInfo } from "../store/store";
import Notification from "../components/Notification.svelte";

const setDeviceInfo = () => {
  let info = new UAParser(navigator.userAgent);
  let deviceName = info.getBrowser()["name"];
  let platform = info.getOS()["name"];
  let type = info.getDevice()["type"] ? info.getDevice()["type"] : "Desktop";

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

export { setDeviceInfo, showToast };
