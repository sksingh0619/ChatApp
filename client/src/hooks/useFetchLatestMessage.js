import { useContext, useEffect, useState } from "react"
import { BASE_URL, getRequest } from "../utility/services";
import { ChatContext } from "../context/ChatContext";

export const useFetchLatestMessage = (chat) => {
    const { newMessage, notifications } = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState(null);
    useEffect(() => {
        const getMessages = async () => {
            const response = await getRequest(`${BASE_URL}/messages/${chat?._id}`);

            if (response.error) {
                return console.log("Error while callig get message :", response);
            }

            const lastMessage = response[response?.length - 1];

            setLatestMessage(lastMessage);
        };
        getMessages();

    }, [newMessage,notifications]);

    return { latestMessage };
}

