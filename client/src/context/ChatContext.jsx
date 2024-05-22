import { createContext, useCallback, useEffect, useState } from "react";
import { BASE_URL, getRequest, postRequest } from "../utility/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(null);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  console.log("Online User chat context : ", onlineUsers);
  useEffect(() => {
    const newSocket = io("http://localhost:4000/");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // add new user
  useEffect(() => {
    if (socket === null) return;

    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  // send message

  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // recieve message and notifications
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members?.some(
        (id) => id === res.senderId
      );

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });
    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${BASE_URL}/users/users`);

      if (response.error) {
        console.log("error :", response);
        return;
      }

      const pChats = response.filter((u) => {
        let isChatCreated = false;

        if (user?._id === u._id) {
          return false;
        }

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }

        return !isChatCreated;
      });

      setPotentialChats(pChats);
      setAllUsers(response);
    };

    getUsers();
  }, [user?._id, userChats,notifications]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);
        const response = await getRequest(`${BASE_URL}/chats/${user?._id}`);

        setIsUserChatsLoading(false);
        if (response.error) {
          return setUserChatsError(response);
        }
        console.log("set chat calling here ", response);
        setUserChats(response);
      }
    };
    getUserChats();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(
        `${BASE_URL}/messages/${currentChat?._id}`
      );

      setIsMessagesLoading(false);

      if (response.error) {
        return setMessagesError(response);
      }

      setMessages(response);
    };
    getMessages();
  }, [currentChat]);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${BASE_URL}/chats`,
      JSON.stringify({ firstId, secondId })
    );

    if (response.error) {
      return console.log("Error creating chat", response);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const sendTextmessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) {
        return console.log("Nothing to send...");
      }

      const response = await postRequest(
        `${BASE_URL}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );
      if (response.error) {
        return sendTextMessageError(response);
      }
      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    []
  );

  const markAllAsReadNotification = useCallback((notifications) => {
    const notificationReaded = notifications.map((m) => {
      return { ...m, isRead: true };
    });

    setNotifications(notificationReaded);
  }, []);

  // read single notification and open chat
  const markAsReadNotification = useCallback(
    (notification, userChats, user, notifications) => {
      //first find the open chat
      debugger
      const openChat = userChats.find((chat) => {
        const chatMember = [user._id, notification.senderId];
        const isDesireChat = chat?.members?.every((member) => {
          return chatMember.includes(member);
        });
        return isDesireChat;
      });

      // mark as read notification
      const readedNotification = notifications.map((n) => {
        if (notification.senderId === n.senderId) {
          return { ...notification, isRead: true };
        } else {
          return n;
        }
      });

      updateCurrentChat(openChat);
      setNotifications(readedNotification);
    },
    []
  );

  // mark as read the single user notification after opening the chat 
  const markThisUserNotification = useCallback((thisUserNotification,notifications)=>{
    const readedNotification = notifications?.map((n)=> {
      let notification;

      thisUserNotification?.forEach(element => {
        if(element.secondId === n.senderId){
          notification = {...n, isRead:true};
        }else{
          notification = element;
        }
      });

      return notification;
    });

    setNotifications(readedNotification);

  },[])
  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        newMessage,
        isMessagesLoading,
        messagesError,
        sendTextmessage,
        sendTextMessageError,
        onlineUsers,
        notifications,
        allUsers,
        markAllAsReadNotification,
        markAsReadNotification,
        markThisUserNotification
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
