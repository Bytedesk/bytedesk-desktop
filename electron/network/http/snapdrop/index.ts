/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-29 10:04:44
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-01 22:24:29
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
import { WebSocketServer } from "ws";
import { PeerInfo } from "./peerinfo";

let wsServer: WebSocketServer;
let rooms = {};
var lan = "lan";

export function startSnapdropServer(server) {
  // console.log("starting snapdrop server");
  wsServer = new WebSocketServer({ server });
  wsServer.on("connection", (socket, request) =>
    onConnection(new PeerInfo(socket, request)),
  );
  wsServer.on("headers", (headers, response) =>
    onHeaders(headers, response),
  );
}

function onConnection(peer: PeerInfo) {
  console.log("peer connected: ", peer.toString());
  joinRoom(peer);
  peer.socket.on("message", (message) => onMessage(peer, message));
  keepAlive(peer);
  // send displayName
  send(peer, {
    type: "display-name",
    message: {
      displayName: peer.name.displayName,
      deviceName: peer.name.deviceName,
    },
  });
}

function onHeaders(headers: string[], response) {
    if (
      response.headers.cookie &&
      response.headers.cookie.indexOf("peerid=") > -1
    )
      return;
    response.peerId = PeerInfo.uuid();
    headers.push(
      "Set-Cookie: peerid=" + response.peerId + "; SameSite=Strict; Secure",
    );
  }

function onMessage(sender: PeerInfo, message) {
    // Try to parse message
    try {
      message = JSON.parse(message);
    } catch (e) {
      return; // TODO: handle malformed JSON
    }

    switch (message.type) {
      case "disconnect":
        leaveRoom(sender);
        break;
      case "pong":
        sender.lastBeat = Date.now();
        break;
    }

    var senderIp = "";
    if (lan == "lan") {
      senderIp = "LAN";
    } else {
      senderIp = sender.ip;
    }

    // relay message to recipient
    if (message.to && rooms[senderIp]) {
      const recipientId = message.to; // TODO: sanitize
      const recipient = rooms[senderIp][recipientId];
      delete message.to;
      // add sender id
      message.sender = sender.id;
      send(recipient, message);
      return;
    }
  }

function joinRoom(peer: PeerInfo) {
    var peerIp = "";
    if (lan == "lan") {
      peerIp = "LAN";
    } else {
      peerIp = peer.ip;
    }
    // if room doesn't exist, create it
    if (!rooms[peerIp]) {
      rooms[peerIp] = {};
    }
    // notify all other peers
    for (const otherPeerId in rooms[peerIp]) {
      const otherPeer = rooms[peerIp][otherPeerId];
      send(otherPeer, {
        type: "peer-joined",
        peer: peer.getInfo(),
      });
    }
    // notify peer about the other peers
    const otherPeers = [];
    for (const otherPeerId in rooms[peerIp]) {
      var ipeer = rooms[peerIp][otherPeerId].getInfo();
      ipeer["ip"] = rooms[peerIp][otherPeerId].ip;
      otherPeers.push(ipeer);
    }
    //
    send(peer, {
      type: "peers",
      peers: otherPeers,
    });
    // add peer to room
    rooms[peerIp][peer.id] = peer;
  }

function leaveRoom(peer: PeerInfo) {
    var peerIp = "";
    if (lan == "lan") {
      peerIp = "LAN";
    } else {
      peerIp = peer.ip;
    }
    if (!rooms[peerIp] || !rooms[peerIp][peer.id]) return;
    cancelKeepAlive(rooms[peerIp][peer.id]);

    // delete the peer
    delete rooms[peerIp][peer.id];

    peer.socket.terminate();
    //if room is empty, delete the room
    if (!Object.keys(rooms[peerIp]).length) {
      delete rooms[peerIp];
    } else {
      // notify all other peers
      for (const otherPeerId in rooms[peerIp]) {
        const otherPeer = rooms[peerIp][otherPeerId];
        send(otherPeer, { type: "peer-left", peerId: peer.id });
      }
    }
  }

function send(peer: PeerInfo, message) {
  if (!peer) return;
  // if (!wsServer || wsServer.readyState !== WebSocket.OPEN) return;
  // if (!peer.socket || peer.socket.readyState !== WebSocket.OPEN) return;
  message = JSON.stringify(message);
  peer.socket.send(message, (error) => "");
}

function keepAlive(peer: PeerInfo) {
  cancelKeepAlive(peer);
  var timeout = 30000;
  if (!peer.lastBeat) {
    peer.lastBeat = Date.now();
  }
  if (Date.now() - peer.lastBeat > 2 * timeout) {
    leaveRoom(peer);
    return;
  }

  send(peer, { type: "ping" });

  peer.timerId = setTimeout(() => keepAlive(peer), timeout);
}

function cancelKeepAlive(peer: PeerInfo) {
  if (peer && peer.timerId) {
    clearTimeout(peer.timerId);
  }
}
