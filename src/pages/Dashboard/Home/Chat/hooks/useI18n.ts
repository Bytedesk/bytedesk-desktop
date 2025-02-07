import { useIntl } from "react-intl";
import { I18N_PREFIX } from "@/utils/constants";

export const useI18n = (currentThread: any) => {
  const intl = useIntl();

  const getAvatar = () => {
    if (!currentThread?.user) return "";
    return currentThread.user.avatar;
  };

  const getNickname = () => {
    if (!currentThread?.user) return "";
    if (currentThread.user.nickname?.startsWith(I18N_PREFIX)) {
      return intl.formatMessage({
        id: currentThread.user.nickname,
        defaultMessage: currentThread.user.nickname,
      });
    }
    return currentThread.user.nickname;
  };

  return {
    getAvatar,
    getNickname
  };
}; 