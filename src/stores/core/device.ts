/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-30 11:44:21
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-11-22 10:41:47
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { DEVICE_STORE } from "@/utils/constants";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface DeviceState {
  devices: DEVICE.Device[];
  currentDevice: DEVICE.Device;
  myDevice: DEVICE.Device;
  //
  addDevice: (device: DEVICE.Device) => void;
  setCurrentDevice: (currentDevice: DEVICE.Device) => void;
  setMyDevice: (myDevice: DEVICE.Device) => void;
  resetDeviceInfo: () => void;
}

export const useDeviceStore = create<DeviceState>()(
  devtools(
    persist(
      immer((set) => ({
        devices: [],
        currentDevice: {
          uid: ""
        },
        myDevice: {
          uid: ""
        },
        addDevice(device) {
          console.log("addDevice", device);
          // let contains = get().devices.find((d) => d.uid === device.uid);
          // if (contains) {
          //   // console.log("device already exists");
          //   return
          // };
          // console.log("addDevice", device);
          // set((state) => {
          //   state.devices = [device, ...state.devices];
          // });
        },
        setCurrentDevice: (currentDevice: DEVICE.Device) => {
          set({ currentDevice });
        },
        setMyDevice(myDevice) {
          set({ myDevice });
        },
        resetDeviceInfo() {
          // set({
          //     currentDevice: {
          //       uid: ""
          //     },
          // });
        },
      })),
      {
        name: DEVICE_STORE,
      },
    ),
  ),
);
