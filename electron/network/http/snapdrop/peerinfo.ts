/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-29 10:09:19
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-01 22:24:59
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import parser from "ua-parser-js";
import {
  uniqueNamesGenerator,
  colors,
  animals,
  names,
} from "unique-names-generator";
import WebSocket from "ws";
//
export class PeerInfo {
  //
  public socket: WebSocket;
  public rtcSupported: boolean;
  public id: string;
  public ip: string;
  public name: {
    model?: string;
    os?: string;
    browser?: string;
    type?: string;
    deviceName?: string;
    displayName?: string;
  };
  public timerId: NodeJS.Timeout;
  public lastBeat: number;

  constructor(socket, request) {
    // set socket
    this.socket = socket;
    // set remote ip
    this._setIP(request);
    // set peer id
    this._setPeerId(request);
    // is WebRTC supported ?
    this.rtcSupported = request.url.indexOf("webrtc") > -1;
    // set name
    this._setName(request);
    // for keepalive
    // this.timerId = 0;
    this.lastBeat = Date.now();
  }

  _setIP(request) {
    if (request.headers["x-forwarded-for"]) {
      this.ip = request.headers["x-forwarded-for"].split(/\s*,\s*/)[0];
    } else {
      this.ip = request.connection.remoteAddress;
    }
    // IPv4 and IPv6 use different values to refer to localhost
    if (this.ip == "::1" || this.ip == "::ffff:127.0.0.1") {
      this.ip = "127.0.0.1";
    }
  }

  _setPeerId(request) {
    if (request.peerId) {
      this.id = request.peerId;
    } else {
      this.id = request.headers.cookie.replace("peerid=", "");
    }
  }

  toString() {
    return `<Peer id=${this.id} ip=${this.ip} rtcSupported=${this.rtcSupported}>`;
  }

  _setName(req) {
    let ua = parser(req.headers["user-agent"]);
    let deviceName = "";

    if (ua.os && ua.os.name) {
      deviceName = ua.os.name.replace("Mac OS", "Mac") + " ";
    }

    if (ua.device.model) {
      deviceName += ua.device.model;
    } else {
      deviceName += ua.browser.name;
    }

    if (!deviceName) deviceName = "Unknown Device";

    const displayName = uniqueNamesGenerator({
      length: 3,
      separator: " ",
      dictionaries: [colors, animals, names],
      style: "capital",
      seed: hashCode(this.id),
    });

    this.name = {
      model: ua.device.model,
      os: ua.os.name,
      browser: ua.browser.name,
      type: ua.device.type,
      deviceName,
      displayName,
    };
  }

  getInfo() {
    return {
      id: this.id,
      name: this.name,
      rtcSupported: this.rtcSupported,
    };
  }

  // return uuid of form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  static uuid() {
    let uuid = "",
      ii;
    for (ii = 0; ii < 32; ii += 1) {
      switch (ii) {
        case 8:
        case 20:
          uuid += "-";
          uuid += ((Math.random() * 16) | 0).toString(16);
          break;
        case 12:
          uuid += "-";
          uuid += "4";
          break;
        case 16:
          uuid += "-";
          uuid += ((Math.random() * 4) | 8).toString(16);
          break;
        default:
          uuid += ((Math.random() * 16) | 0).toString(16);
      }
    }
    return uuid;
  }
}


function hashCode(name) {
  var hash = 0,
    i,
    chr;
  for (i = 0; i < name.length; i++) {
    chr = name.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
