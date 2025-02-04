/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-06 17:51:37
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-06 23:45:01
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
/**
 * Mac 获取媒体权限
 */
import {ipcMain, systemPreferences} from 'electron'

export enum EMediaType {
  microphone = 'microphone', // 麦克风
  camera = 'camera', // 相机
}

/**
 * 访问状态
 *  'not-determined'：[未确定]表示用户尚未做出决定，或者系统尚未提示用户进行授权。
 *  'granted'：[已授权]表示用户已经明确授予了应用的权限。
 *  'denied'：[拒绝]表示用户拒绝了应用授权的请求。
 *  'restricted'：[受限]在某些情况下，可能是由于系统策略或其他安全限制导致应用无法获得改权限。
 *  'unknown'：[未知]在无法确定权限状态的情况下返回，可能是因为某种错误或其他不可预知的情况。
 */
export type IAccessStatus = 'not-determined' | 'granted' | 'denied' | 'restricted' | 'unknown'

/**
 * 请求媒体权限
 * @param mediaType
 */
export const requestMediaAccess = async (mediaType: EMediaType): Promise<IAccessStatus> => {
    console.log('requestMediaAccess', mediaType)

  try {
    // 获取当前媒体设备（在这里指麦克风或摄像头）的访问权限状态
    const privilege: IAccessStatus = systemPreferences.getMediaAccessStatus(mediaType)

    if (privilege !== 'granted') {
      console.log('requestMediaAccess status:', privilege)
      // 未授权,则重新唤起系统弹框,等待用户点击授权
      await systemPreferences.askForMediaAccess(mediaType)
      // 请求权限后，再次获取媒体访问状态并返回
      return systemPreferences.getMediaAccessStatus(mediaType)
    }
    // 已授权,则直接返回媒体访问状态
    return privilege
  } catch (e) {
    console.error('Failed to request media access:', e)
    return 'unknown'
  }
}
