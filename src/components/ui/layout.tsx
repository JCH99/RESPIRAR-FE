import { Container } from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import Navbar from "./navbar";

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useRouter();

  const isAuthView = pathname === "/auth";
  return (
    <>
      {!isAuthView && <Navbar />}
      <Container
        maxWidth={!isAuthView && "xl"}
        component={"main"}
        disableGutters={isAuthView}
      >
        {children}
      </Container>
    </>
  );
}
