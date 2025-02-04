/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-30 11:44:21
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-06 07:42:19
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
//
import { CONTACT_STORE, CONTACT_TYPE_DEVICE, CONTACT_TYPE_MEMBER } from "@/utils/constants";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface ContactState {
  // 新朋友
  newfriends: CONTACT.Contact[];
  // 设备
  devices: CONTACT.Contact[];
  // 群聊
  groups: CONTACT.Contact[];
  // 频道
  channels: CONTACT.Contact[];
  // 企业联系人
  members: CONTACT.Contact[];
  // 联系人
  friends: CONTACT.Contact[];
  // 当前联系人信息
  currentContact: CONTACT.Contact;
  // 当前企业联系人信息
  memberSelf: CONTACT.Contact;
  //
  addNewfriend: (contact: CONTACT.Contact) => void;
  addDevice: (contact: CONTACT.Contact) => void;
  addGroup: (contact: CONTACT.Contact) => void;
  addChannel: (contact: CONTACT.Contact) => void;
  addMember: (contact: CONTACT.Contact) => void;
  addFriend: (contact: CONTACT.Contact) => void;
  //
  setCurrentContact: (currentContact: CONTACT.Contact) => void;
  setMemberSelf: (memberSelf: CONTACT.Contact) => void;
  resetContactInfo: () => void;
}

export const useContactStore = create<ContactState>()(
  devtools(
    persist(
      immer((set, get) => ({
        newfriends: [],
        devices: [],
        groups: [],
        channels: [],
        members: [],
        friends: [],
        //
        currentContact: {
          type: "",
          device: {
            uid: ""
          }
        },
        memberSelf: {
          type: "",
          member: {
            uid: ""
          }
        },
        addNewfriend(contact) {
          console.log('addNewfriend', contact);
        },
        addDevice(contact) {
          if (contact.type === CONTACT_TYPE_DEVICE) {
            const contains = get().devices.some(
              (item) => item.device.uid === contact.device.uid,
            );
            if (!contains) {
              set({ devices: [contact, ...get().devices] });
            } else {
              set({
                devices: [ contact, ...get().devices.filter((item) => item.device.uid !== contact.device.uid)],
              });
            }
            if (get().currentContact.device?.uid === contact.device.uid) {
              set({ currentContact: contact });
            }
          }
        },
        addGroup(contact) {
          console.log('addGroup', contact); // 群聊
        },
        addChannel(contact) {
          console.log('addChannel', contact); // 频道
        },
        addMember(contact) {
          if (contact.type === CONTACT_TYPE_MEMBER) {
            const contains = get().members.some(
              (item) => item.member.uid === contact.member.uid,
            );
            if (!contains) {
              set({ members: [...get().members, contact] });
            } else {
              set({
                members: [
                  contact,
                  ...get().members.filter(
                    (item) => item.member.uid !== contact.member.uid,
                  ),
                ],
              });
            }
          }
        },
        addFriend(contact) {
          console.log('addFriend', contact); // 联系人
        },
        setCurrentContact: (currentContact: CONTACT.Contact) => {
          set({ currentContact });
        },
        setMemberSelf: (memberSelf: CONTACT.Contact) => {
          set({ memberSelf });
        },
        resetContactInfo() {
          set({
            newfriends: [],
            devices: [],
            groups: [],
            channels: [],
            members: [],
            friends: [],
            currentContact: {
              type: "",
              device: {
                uid: "",
              },
            },
            memberSelf: {
              type: "",
              member: {
                uid: "",
              },
            },
          });
        },
      })),
      {
        name: CONTACT_STORE,
      },
    ),
  ),
);
