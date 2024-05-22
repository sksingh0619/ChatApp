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
  const [loginInfo, setLoginInfo] = useState({
    name: "",
    email: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  useEffect(() => {
    let user = localStorage.getItem("User");
    setUser(JSON.parse(user));
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);
  
  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();

      setIsRegisterLoading(true);
      setRegisterError(null);

      const response = await postRequest(
        `${BASE_URL}/users/register`,
        JSON.stringify(registerInfo)
      );

      if (response.error) {
        setIsRegisterLoading(false);
        return setRegisterError(response);
      } else {
        localStorage.setItem("User", JSON.stringify(response));
      }

      setUser(response);
      setIsRegisterLoading(false);
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);

      const response = await postRequest(
        `${BASE_URL}/users/login`,
        JSON.stringify(loginInfo)
      );

      if (response.error) {
        setIsLoginLoading(false);
        return setLoginError(response);
      } else {
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
        setIsLoginLoading(false);
      }
    },
    [loginInfo]
  );
  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
