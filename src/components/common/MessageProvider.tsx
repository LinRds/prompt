import { message } from 'antd';
import { createContext, useContext } from 'react';

const MessageContext = createContext<{
  success: (content: string) => void;
  warning: (content: string) => void;
  error: (content: string) => void;
}>({
  success: () => {},
  warning: () => {},
  error: () => {},
});

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const value = {
    success: (content: string) => messageApi.success(content),
    warning: (content: string) => messageApi.warning(content),
    error: (content: string) => messageApi.error(content),
  };

  return (
    <MessageContext.Provider value={value}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  return useContext(MessageContext);
}; 