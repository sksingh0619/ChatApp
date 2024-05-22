import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  console.log("potential charts ->", potentialChats);
  return (
    <div>
      <div className="all-users">
        {potentialChats &&
          potentialChats?.map((u, index) => {
            return (
              <div
                className="single-user"
                key={index}
                onClick={() => createChat(user._id, u._id)}
              >
                {u.name}
                <apan
                  className={
                    onlineUsers?.some((user) => user.userId === u?._id)
                      ? "user-online"
                      : ""
                  }
                ></apan>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PotentialChats;
