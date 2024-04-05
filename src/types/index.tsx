export type MessageType = {
  name: string;
  message: string;
};

export type ChatProps = {
  messages: MessageType[];
  sendMessage: () => void;
  message: string;
  setMessage: (message: string) => void;
};
