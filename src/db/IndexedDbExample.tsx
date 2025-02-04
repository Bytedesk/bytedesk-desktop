/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-28 21:43:30
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-21 09:00:26
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// MyComponent.tsx
import React, { useState } from "react";
import { useIndexedDB } from "./useIndexedDB";
// https://dexie.org/docs/dexie-react-hooks/useLiveQuery()
// import { useLiveQuery } from "dexie-react-hooks";

const IndexedDbExample = () => {
  const { messages, updateMessage, deleteMessage } =
    useIndexedDB();
  const [newMessageContent, setNewMessageContent] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const handleUpdateMessage = async () => {
    if (selectedMessageId !== null) {
      await updateMessage(selectedMessageId, newMessageContent);
      setSelectedMessageId(null);
      setNewMessageContent("");
    }
  };

  const handleDeleteMessage = async (uid: string) => {
    await deleteMessage(uid);
  };

  return (
    <div>
      <h1>Messages</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.uid}>
            {message.content}
            <button
              onClick={() => {
                setSelectedMessageId(message.uid);
                setNewMessageContent(message.content);
              }}
            >
              Edit
            </button>
            <button onClick={() => handleDeleteMessage(message.uid)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newMessageContent}
          onChange={(e) => setNewMessageContent(e.target.value)}
          placeholder="Enter new message"
        />
        {/* <button onClick={handleCreateNewMessage}>Create</button> */}
        {selectedMessageId !== null && (
          <button onClick={handleUpdateMessage}>Update</button>
        )}
      </div>
    </div>
  );
};

export default IndexedDbExample;
