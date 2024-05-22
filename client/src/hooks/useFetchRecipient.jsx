import React, { useEffect, useState } from "react";
import { BASE_URL, getRequest } from "../utility/services";

export const useFetchRecipient = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipeintId = chat?.members.find((id) => id !== user?._id);

  useEffect(() => {
    const getUser = async () => {
      if (!recipeintId) return null;

      const response = await getRequest(
        `${BASE_URL}/users/find/${recipeintId}`
      );
      if(response.error){
        return setError(response);
      }

      setRecipientUser(response);
    };
    getUser();
  },[recipeintId]);

  return {recipientUser};
};
