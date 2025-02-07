import { useIntl } from 'react-intl';

export const useMentionOptions = () => {
  const intl = useIntl();
  
  const mentionOptions = {
    "@": [
      { value: "all", label: "所有人" },
      { value: "one", label: "Person" },
    ],
    "/": [
      { value: "test1", label: "Test1" },
      { value: "test2", label: "Test2" },
    ],
  };

  return {
    mentionOptions
  };
}; 