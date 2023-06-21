import { useState } from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../src/createEmotionCache";
import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
} from "@tanstack/react-query";
import { AuthProvider } from "../context/auth-context";
import SnackbarsProvider from "../context/snackbars-context";

const clientSideEmotionCache = createEmotionCache();

const theme = createTheme();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <AuthProvider>
          <CacheProvider value={emotionCache}>
            <Head>
              <meta
                name="viewport"
                content="initial-scale=1, width=device-width"
              />
            </Head>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SnackbarsProvider>
                <Component {...pageProps} />
              </SnackbarsProvider>
            </ThemeProvider>
          </CacheProvider>
        </AuthProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
