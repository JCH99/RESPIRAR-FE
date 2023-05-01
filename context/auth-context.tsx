import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setCookie, deleteCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import { tokenInterceptor } from "../utils/interceptors";
import axios from "axios";

export interface AContext {
  token?: string;
  setCurrentToken: (user: any) => void;
}

export const AuthContext = createContext<AContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | undefined>(undefined);

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
      // router.push("/auth");
    }
  }, [token]);

  const localLogout = async () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setCurrentToken(undefined);
    router.push("/auth");
  };

  const stateValues: AContext = {
    token,
    setCurrentToken,
  };

  return (
    <AuthContext.Provider value={stateValues}>{children}</AuthContext.Provider>
  );
};
