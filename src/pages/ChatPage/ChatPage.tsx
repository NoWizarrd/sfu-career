import React, { useEffect, useState } from "react";
import styles from "./ChatPage.module.scss";
import { jwtDecode } from "jwt-decode";
import ModalChat from "../../components/modals/ModalChat/ModalChat";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Loader from "../../components/loader/Loader";

interface JWT {
  _id: string;
  user: "student" | "company";
  exp: number;
  iat: number;
}

interface Message {
  sender: string;
  text: string;
  timestamp: Date;
}

interface Chat {
  _id: string;
  participants: string[];
  participantsModel: string[];
  messages: Message[];
}

interface Participant {
  _id: string;
  name?: string;
  surname?: string;
}

const fetchChats = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:4444/chats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

const fetchMessages = async (chatId: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:4444/chats/${chatId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

const fetchParticipant = async (id: string, model: string): Promise<Participant> => {
  const token = localStorage.getItem("token");
  const endpoint = model === "Company" ? "companies" : "students";
  const response = await fetch(`http://localhost:4444/${endpoint}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [participantsNames, setParticipantsNames] = useState<{ [key: string]: string }>({});
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  let userId: string | undefined;
  let userType: string | undefined;

  if (token) {
    const { _id, user } = jwtDecode<JWT>(token);
    userId = _id;
    userType = user;
  }

  const { data: chats, isLoading: isLoadingChats, isError: chatError } = useQuery<Chat[]>("chats", fetchChats);

  const { data: messages, isLoading: isLoadingMessages, isError: messagesError } = useQuery(
    ["messages", selectedChat?._id],
    () => selectedChat ? fetchMessages(selectedChat._id) : Promise.resolve([]),
    {
      enabled: !!selectedChat,
      refetchInterval: 2000,
    }
  );

  const sendMessageMutation = useMutation(
    async () => {
      const response = await fetch(`http://localhost:4444/chats/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender: userId,
          senderModel: userType,
          recipient: selectedChat?.participants.find((p) => p !== userId),
          recipientModel: selectedChat?.participantsModel.find((m) => m !== userType),
          text: messageText,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["messages", selectedChat?._id]);
        setMessageText("");
      },
    }
  );

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    sendMessageMutation.mutate();
  };

  const loadParticipantNames = async (chats: Chat[]) => {
    const names: { [key: string]: string } = {};

    for (const chat of chats) {
      for (let i = 0; i < chat.participants.length; i++) {
        const participantId = chat.participants[i];
        const participantModel = chat.participantsModel[i];

        if (!names[participantId]) {
          const participant = await fetchParticipant(participantId, participantModel);
          names[participantId] = participantModel === "Company" ? participant.name! : `${participant.surname} ${participant.name}`;
        }
      }
    }

    setParticipantsNames(names);
  };

  useEffect(() => {
    if (chats) {
      loadParticipantNames(chats);
    }
  }, [chats]);

  const handleOpenChat = (chat: Chat) => {
    setSelectedChat(chat);
    setIsChatModalOpen(false);
  };

  if (isLoadingChats) return <Loader />;
  if (!chats || chats.length === 0) {
    return <div className={styles.pageContainer}>
      <div className={styles.noChatsMessage}>Чатов нет, напишите кому-то первое сообщение</div>
    </div>;
  }

  if ((selectedChat && isLoadingMessages) || Object.keys(participantsNames).length === 0) return <Loader />;

  if (chatError || messagesError) return <div className={styles.pageContainer}>Ошибка загрузки данных.</div>;

  return (
<div className={styles.pageContainer}>
  <div className={styles.chatContainer}>
    <div className={styles.chatList}>
      {chats?.map((chat) => {
        const participantIndex = chat.participants.findIndex((participant) => participant !== userId);
        const participantId = chat.participants[participantIndex];
        return (
          <div
            key={chat._id}
            className={`${styles.chatItem} ${selectedChat?._id === chat._id ? styles.activeChat : ""}`}
            onClick={() => handleOpenChat(chat)}
          >
            <div className={styles.chatInfo}>
              <div className={styles.chatTitle}>
                {participantsNames[participantId] || "Загрузка..."}
              </div>
            </div>
          </div>
        );
      })}
    </div>

    <div className={styles.chatWindow}>
      {selectedChat ? (
        <>
          <div className={styles.messagesContainer}>
            {messages?.map((message: Message, index: number) => (
              <div key={index} className={`${styles.message} ${message.sender === userId ? styles.userMessage : styles.partnerMessage}`}>
                <div className={styles.messageSender}>
                  {message.sender === userId ? "Вы" : participantsNames[message.sender] || "Собеседник"}
                </div>
                <div className={styles.messageText}>{message.text}</div>
              </div>
            ))}
          </div>
          <div className={styles.sendMessageContainer}>
            <textarea
              className={styles.sendMessageTextarea}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Введите сообщение..."
            />
            <button className={styles.sendMessageButton} onClick={handleSendMessage}>
              Отправить
            </button>
          </div>
        </>
      ) : (
        <div>Выберите, кому хотели бы написать</div>
      )}
    </div>
  </div>

  {selectedChat && (
    <ModalChat
      isOpen={isChatModalOpen}
      onClose={() => setIsChatModalOpen(false)}
      onSend={handleSendMessage}
    />
  )}
</div>


  );
};

export default ChatPage;