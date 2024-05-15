import { createContext, useCallback, useEffect, useState } from "react";
import { BASE_URL, postRequest } from "../utility/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  console.log("after page refresh user",user);

  useEffect(() => {
    let user = localStorage.getItem("User");
    setUser(JSON.parse(user));
  },[])
  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const registerUser = useCallback(async (e) => {
    e.preventDefault();
    
    setIsRegisterLoading(true);
    setRegisterError(null);

    const response = await postRequest(
      `${BASE_URL}/users/register`,
      JSON.stringify(registerInfo)
    );

    if (response.error) {
      setRegisterError(response);
    }else{
      localStorage.setItem("User", JSON.stringify(response));
    }

    setUser(response);
    setIsRegisterLoading(false);
  }, [registerInfo]);

const logoutUser = useCallback(() => {
  localStorage.removeItem("User");
  setUser(null);
},[]);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
