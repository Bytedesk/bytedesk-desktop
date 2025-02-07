/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-07 11:46:20
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-07 12:33:25
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const useScreenshot = (setScreenShotImg: any, setIsScreenRecorderModelOpen: any) => {
  const getShotScreenImg = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const canvas = document.createElement("canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.play();

      videoElement.addEventListener("loadedmetadata", () => {
        const context = canvas.getContext("2d");
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/png");
        setScreenShotImg(dataURL);
        setIsScreenRecorderModelOpen(true);
        stream.getTracks().forEach((track) => track.stop());
      });
    } catch (error) {
      console.error("Error accessing screen:", error);
    }
  };

  return {
    getShotScreenImg
  };
}; 