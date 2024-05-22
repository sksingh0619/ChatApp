import React, { useContext } from "react";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import avtar from "../../assets/avtar.svg";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsF } from "../../utility/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipient(chat, user);
  const { onlineUsers, notifications, markThisUserNotification } = useContext(ChatContext);

  const {latestMessage} = useFetchLatestMessage(chat);

  const unreadNotification = unreadNotificationsF(notifications);
  const thisUserNotification = unreadNotification?.filter(
    (n) => n.senderId === recipientUser?._id
  );

  const isOnline = onlineUsers?.some(
    (user) => user.userId === recipientUser?._id
  );

  const truncateText = (text) => {
    if(text.length > 15){
      return text.subString(0,15)+"...";
    }else
      return text;

  }
  return (
    <div>
      <Stack
        direction="horizontal"
        gap={3}
        className="user-card align-items-center p-2 justify-content-between "
        role="button"
        onClick={() => {
          if(thisUserNotification.length > 0){
            markThisUserNotification(thisUserNotification,notifications);
          }
        }}
      >
        <div className="d-flex">
          <div className="me-2">
            <img src={avtar} alt="userImage" height="35px" />
          </div>
          <div className="text-content">
            <div className="name text-white">{recipientUser?.name}</div>
            <div className="text">{latestMessage?.text && (
              <span>{truncateText(latestMessage.text)}
              </span>)}
              </div>
          </div>
        </div>
        <div className="d-flex">
          <div className="data text-end ">{moment(latestMessage?.createdAt).calendar()}</div>
          <div className={thisUserNotification?.length > 0 ? "this-user-notifications" : ""}>
            {thisUserNotification?.length > 0 ? thisUserNotification?.length :""}
          </div>
          <span className={isOnline ? "user-online" : ""}></span>
        </div>
      </Stack>
    </div>
  );
};

export default UserChat;
