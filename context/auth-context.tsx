import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setCookie, deleteCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import { tokenInterceptor } from "../utils/interceptors";
import axios from "axios";
import { User } from "../utils/interfaces";
import { getUserInfoViaTokenReq } from "../api/api";

export interface AContext {
  token?: string;
  user?: User;
  setCurrentToken: (user: any) => void;
}

export const AuthContext = createContext<AContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);

  const { data: userInfoViaToken } = useQuery(
    ["getUserInfoViaToken", token],
    () => getUserInfoViaTokenReq(token!),
    {
      enabled: !!token,
    }
  );

  useEffect(() => {
    if (userInfoViaToken) {
      setUser(userInfoViaToken.data.User);
    }
  }, [userInfoViaToken]);

  useEffect(() => {
    const tokenLS = localStorage.getItem("token");
    const tokenSS = sessionStorage.getItem("token");
    setCurrentToken(tokenLS || tokenSS || undefined);
  }, []);

  const setCurrentToken = (token: string | undefined) => {
    setToken(token);
    setCookie("token", token);
  };

  useEffect(() => {
    if (token) {
      setCurrentToken(token);
      tokenInterceptor(token);
      router.push("/main");
    } else {
      router.push("/auth");
    }
  }, [token]);

  const localLogout = async () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    deleteCookie("token");
    setCurrentToken(undefined);
    router.push("/auth");
  };

  const stateValues: AContext = {
    token,
    setCurrentToken,
    user,
  };

  return (
    <AuthContext.Provider value={stateValues}>{children}</AuthContext.Provider>
  );
};
