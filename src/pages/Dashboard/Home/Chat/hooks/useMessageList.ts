import { useEffect } from 'react';
import { useMessageStore } from "@/stores/core/message";
import { useThreadStore } from "@/stores/core/thread";
import { isOrgMemberTopic, getOrgMemberTopicReverse } from "@/utils/utils";
import moment from 'moment';
import { useIntl } from 'react-intl';

export const useMessageList = (resetList: any, translateString: any) => {
  const intl = useIntl();
  const { messageList, addMessageList, updateMessage } = useMessageStore((state) => ({
    messageList: state.messageList,
    addMessageList: state.addMessageList,
    updateMessage: state.updateMessage,
  }));

  const { currentThread } = useThreadStore((state) => ({
    currentThread: state.currentThread,
  }));

  const getMessagePosition = (item: any) => {
    if (item?.fromUser?.uid === currentThread?.user?.uid) {
      return "left";
    }
    return "right";
  };

  useEffect(() => {
    const list = [];
    messageList.forEach((item) => {
      let flag = false;
      if (isOrgMemberTopic(currentThread?.topic)) {
        const reverseTopic = getOrgMemberTopicReverse(currentThread?.topic);
        if (item?.threadTopic === currentThread?.topic) {
          flag = true;
        } else if (item?.threadTopic === reverseTopic) {
          flag = true;
        }
      } else if (item?.threadTopic === currentThread?.topic) {
        flag = true;
      }
      if (flag) {
        list.push({
          _id: item?.uid,
          type: item?.type,
          status: item?.status,
          hasTime: true,
          createdAt: moment(item?.createdAt).toDate().getTime(),
          content: translateString(item?.content),
          position: getMessagePosition(item),
          user: {
            avatar: item?.user?.avatar,
            name: translateString(item?.user?.nickname),
          },
        });
      }
    });
    resetList(list);
  }, [messageList, currentThread]);

  return {
    messageList,
    addMessageList,
    updateMessage,
    getMessagePosition
  };
}; 