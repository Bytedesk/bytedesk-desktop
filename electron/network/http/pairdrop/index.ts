/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-29 10:51:11
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-04-29 11:53:31
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// import crypto from "crypto";
import { WebSocketServer } from "ws";
import PairPeer from "./pairpeer";
import { hashCode, randomizer } from "./helper";
import conf from "./config";

let wsServer: WebSocketServer;
let rooms = {}; // { roomId: peers[] }
let roomSecrets = {}; // { pairKey: roomSecret }
let keepAliveTimers = {};

//
export function startPairDropServer(server) {
  //
  wsServer = new WebSocketServer({ server });
  // FIXME: 导致客户端未响应，卡死
  // wsServer.on("connection", (socket, request) =>
  //   onConnection(new PairPeer(socket, request, conf)),
  // );
}

function onConnection(peer) {
  peer.socket.on("message", (message) => onMessage(peer, message));
  peer.socket.onerror = (e) => console.error(e);

  keepAlive(peer);

  send(peer, {
    type: "ws-config",
    wsConfig: {
      rtcConfig: conf.rtcConfig,
      wsFallback: conf.wsFallback,
    },
  });

  // send displayName
  send(peer, {
    type: "display-name",
    displayName: peer.name.displayName,
    deviceName: peer.name.deviceName,
    peerId: peer.id,
    // peerIdHash: hasher.hashCodeSalted(peer.id),
    peerIdHash: hashCode(peer.id),
  });
}

function onMessage(sender, message) {
  // Try to parse message
  try {
    message = JSON.parse(message);
  } catch (e) {
    console.warn("WS: Received JSON is malformed");
    return;
  }

  switch (message.type) {
    case "disconnect":
      onDisconnect(sender);
      break;
    case "pong":
      setKeepAliveTimerToNow(sender);
      break;
    case "join-ip-room":
      joinIpRoom(sender);
      break;
    case "room-secrets":
      onRoomSecrets(sender, message);
      break;
    case "room-secrets-deleted":
      onRoomSecretsDeleted(sender, message);
      break;
    case "pair-device-initiate":
      onPairDeviceInitiate(sender);
      break;
    case "pair-device-join":
      onPairDeviceJoin(sender, message);
      break;
    case "pair-device-cancel":
      onPairDeviceCancel(sender);
      break;
    case "regenerate-room-secret":
      onRegenerateRoomSecret(sender, message);
      break;
    case "create-public-room":
      onCreatePublicRoom(sender);
      break;
    case "join-public-room":
      onJoinPublicRoom(sender, message);
      break;
    case "leave-public-room":
      onLeavePublicRoom(sender);
      break;
    case "signal":
      signalAndRelay(sender, message);
      break;
    case "request":
    case "header":
    case "partition":
    case "partition-received":
    case "progress":
    case "files-transfer-response":
    case "file-transfer-complete":
    case "message-transfer-complete":
    case "text":
    case "display-name-changed":
    case "ws-chunk":
      // relay ws-fallback
      if (conf.wsFallback) {
        signalAndRelay(sender, message);
      } else {
        console.log("Websocket fallback is not activated on this instance.");
      }
  }
}

function signalAndRelay(sender, message) {
  const room = message.roomType === "ip" ? sender.ip : message.roomId;

  // relay message to recipient
  if (message.to && PairPeer.isValidUuid(message.to) && rooms[room]) {
    const recipient = rooms[room][message.to];
    delete message.to;
    // add sender
    message.sender = {
      id: sender.id,
      rtcSupported: sender.rtcSupported,
    };
    send(recipient, message);
  }
}

function onDisconnect(sender) {
  disconnect(sender);
}

function disconnect(sender) {
  removePairKey(sender.pairKey);
  sender.pairKey = null;

  cancelKeepAlive(sender);
  delete keepAliveTimers[sender.id];

  leaveIpRoom(sender, true);
  leaveAllSecretRooms(sender, true);
  leavePublicRoom(sender, true);

  sender.socket.terminate();
}

function onRoomSecrets(sender, message) {
  if (!message.roomSecrets) return;

  const roomSecrets = message.roomSecrets.filter((roomSecret) => {
    return /^[\x00-\x7F]{64,256}$/.test(roomSecret);
  });

  if (!roomSecrets) return;

  joinSecretRooms(sender, roomSecrets);
}

function onRoomSecretsDeleted(sender, message) {
  for (let i = 0; i < message.roomSecrets.length; i++) {
    deleteSecretRoom(message.roomSecrets[i]);
  }
}

function deleteSecretRoom(roomSecret) {
  const room = rooms[roomSecret];
  if (!room) return;

  for (const peerId in room) {
    const peer = room[peerId];

    leaveSecretRoom(peer, roomSecret, true);

    send(peer, {
      type: "secret-room-deleted",
      roomSecret: roomSecret,
    });
  }
}

function onPairDeviceInitiate(sender) {
  let roomSecret = randomizer.getRandomString(256);
  let pairKey = createPairKey(sender, roomSecret);

  if (sender.pairKey) {
    removePairKey(sender.pairKey);
  }
  sender.pairKey = pairKey;

  send(sender, {
    type: "pair-device-initiated",
    roomSecret: roomSecret,
    pairKey: pairKey,
  });
  joinSecretRoom(sender, roomSecret);
}

function onPairDeviceJoin(sender, message) {
  if (sender.rateLimitReached()) {
    send(sender, { type: "join-key-rate-limit" });
    return;
  }

  if (
    !roomSecrets[message.pairKey] ||
    sender.id === roomSecrets[message.pairKey].creator.id
  ) {
    send(sender, { type: "pair-device-join-key-invalid" });
    return;
  }

  const roomSecret = roomSecrets[message.pairKey].roomSecret;
  const creator = roomSecrets[message.pairKey].creator;
  removePairKey(message.pairKey);
  send(sender, {
    type: "pair-device-joined",
    roomSecret: roomSecret,
    peerId: creator.id,
  });
  send(creator, {
    type: "pair-device-joined",
    roomSecret: roomSecret,
    peerId: sender.id,
  });
  joinSecretRoom(sender, roomSecret);
  removePairKey(sender.pairKey);
}

function onPairDeviceCancel(sender) {
  const pairKey = sender.pairKey;

  if (!pairKey) return;

  removePairKey(pairKey);
  send(sender, {
    type: "pair-device-canceled",
    pairKey: pairKey,
  });
}

function onCreatePublicRoom(sender) {
  let publicRoomId = randomizer.getRandomString(5, true).toLowerCase();

  send(sender, {
    type: "public-room-created",
    roomId: publicRoomId,
  });

  joinPublicRoom(sender, publicRoomId);
}

function onJoinPublicRoom(sender, message) {
  if (sender.rateLimitReached()) {
    send(sender, { type: "join-key-rate-limit" });
    return;
  }

  if (!rooms[message.publicRoomId] && !message.createIfInvalid) {
    send(sender, {
      type: "public-room-id-invalid",
      publicRoomId: message.publicRoomId,
    });
    return;
  }

  leavePublicRoom(sender);
  joinPublicRoom(sender, message.publicRoomId);
}

function onLeavePublicRoom(sender) {
  leavePublicRoom(sender, true);
  send(sender, { type: "public-room-left" });
}

function onRegenerateRoomSecret(sender, message) {
  const oldRoomSecret = message.roomSecret;
  const newRoomSecret = randomizer.getRandomString(256);

  // notify all other peers
  for (const peerId in rooms[oldRoomSecret]) {
    const peer = rooms[oldRoomSecret][peerId];
    send(peer, {
      type: "room-secret-regenerated",
      oldRoomSecret: oldRoomSecret,
      newRoomSecret: newRoomSecret,
    });
    peer.removeRoomSecret(oldRoomSecret);
  }
  delete rooms[oldRoomSecret];
}

function createPairKey(creator, roomSecret) {
  let pairKey;
  do {
    // get randomInt until keyRoom not occupied
    // pairKey = crypto.randomInt(1000000, 1999999).toString().substring(1); // include numbers with leading 0s
    pairKey = randomizer.getRandomString(6, true); // include numbers without leading 0s
  } while (pairKey in roomSecrets);

  roomSecrets[pairKey] = {
    roomSecret: roomSecret,
    creator: creator,
  };

  return pairKey;
}

function removePairKey(pairKey) {
  if (pairKey in roomSecrets) {
    roomSecrets[pairKey].creator.pairKey = null;
    delete roomSecrets[pairKey];
  }
}

function joinIpRoom(peer) {
  joinRoom(peer, "ip", peer.ip);
}

function joinSecretRoom(peer, roomSecret) {
  joinRoom(peer, "secret", roomSecret);

  // add secret to peer
  peer.addRoomSecret(roomSecret);
}

function joinPublicRoom(peer, publicRoomId) {
  // prevent joining of 2 public rooms simultaneously
  leavePublicRoom(peer);

  joinRoom(peer, "public-id", publicRoomId);

  peer.publicRoomId = publicRoomId;
}

function joinRoom(peer, roomType, roomId) {
  // roomType: 'ip', 'secret' or 'public-id'
  if (rooms[roomId] && rooms[roomId][peer.id]) {
    // ensures that otherPeers never receive `peer-left` after `peer-joined` on reconnect.
    leaveRoom(peer, roomType, roomId);
  }

  // if room doesn't exist, create it
  if (!rooms[roomId]) {
    rooms[roomId] = {};
  }

  notifyPeers(peer, roomType, roomId);

  // add peer to room
  rooms[roomId][peer.id] = peer;
}

function leaveIpRoom(peer, disconnect = false) {
  leaveRoom(peer, "ip", peer.ip, disconnect);
}

function leaveSecretRoom(peer, roomSecret, disconnect = false) {
  leaveRoom(peer, "secret", roomSecret, disconnect);

  //remove secret from peer
  peer.removeRoomSecret(roomSecret);
}

function leavePublicRoom(peer, disconnect = false) {
  if (!peer.publicRoomId) return;

  leaveRoom(peer, "public-id", peer.publicRoomId, disconnect);

  peer.publicRoomId = null;
}

function leaveRoom(peer, roomType, roomId, disconnect = false) {
  if (!rooms[roomId] || !rooms[roomId][peer.id]) return;

  // remove peer from room
  delete rooms[roomId][peer.id];

  // delete room if empty and abort
  if (!Object.keys(rooms[roomId]).length) {
    delete rooms[roomId];
    return;
  }

  // notify all other peers that remain in room that peer left
  for (const otherPeerId in rooms[roomId]) {
    const otherPeer = rooms[roomId][otherPeerId];

    let msg = {
      type: "peer-left",
      peerId: peer.id,
      roomType: roomType,
      roomId: roomId,
      disconnect: disconnect,
    };

    send(otherPeer, msg);
  }
}

function notifyPeers(peer, roomType, roomId) {
  if (!rooms[roomId]) return;

  // notify all other peers that peer joined
  for (const otherPeerId in rooms[roomId]) {
    if (otherPeerId === peer.id) continue;
    const otherPeer = rooms[roomId][otherPeerId];

    let msg = {
      type: "peer-joined",
      peer: peer.getInfo(),
      roomType: roomType,
      roomId: roomId,
    };

    send(otherPeer, msg);
  }

  // notify peer about peers already in the room
  const otherPeers = [];
  for (const otherPeerId in rooms[roomId]) {
    if (otherPeerId === peer.id) continue;
    otherPeers.push(rooms[roomId][otherPeerId].getInfo());
  }

  let msg = {
    type: "peers",
    peers: otherPeers,
    roomType: roomType,
    roomId: roomId,
  };

  send(peer, msg);
}

function joinSecretRooms(peer, roomSecrets) {
  for (let i = 0; i < roomSecrets.length; i++) {
    joinSecretRoom(peer, roomSecrets[i]);
  }
}

function leaveAllSecretRooms(peer, disconnect = false) {
  for (let i = 0; i < peer.roomSecrets.length; i++) {
    leaveSecretRoom(peer, peer.roomSecrets[i], disconnect);
  }
}

function send(peer, message) {
  if (!peer) return;
  // if (!wsServer || wsServer.readyState !== WebSocket.OPEN) return;
  message = JSON.stringify(message);
  peer.socket.send(message);
}

function keepAlive(peer) {
  cancelKeepAlive(peer);
  let timeout = 1000;

  if (!keepAliveTimers[peer.id]) {
    keepAliveTimers[peer.id] = {
      timer: 0,
      lastBeat: Date.now(),
    };
  }

  if (Date.now() - keepAliveTimers[peer.id].lastBeat > 5 * timeout) {
    // Disconnect peer if unresponsive for 10s
    disconnect(peer);
    return;
  }
  // 
  send(peer, { type: "ping" });
  keepAliveTimers[peer.id].timer = setTimeout(() => keepAlive(peer), timeout);
}

function cancelKeepAlive(peer) {
  if (keepAliveTimers[peer.id]?.timer) {
    clearTimeout(keepAliveTimers[peer.id].timer);
  }
}

function setKeepAliveTimerToNow(peer) {
  if (keepAliveTimers[peer.id]?.lastBeat) {
    keepAliveTimers[peer.id].lastBeat = Date.now();
  }
}
