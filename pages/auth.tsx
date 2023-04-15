import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Image from "next/image";
import Login from "../src/components/auth/login";
import Signup from "../src/components/signup";
import { FadeInComponent } from "../src/components/animations";

const theme = createTheme();

export default function SignInSide() {
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />

        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            position: "relative",
          }}
        >
          <Image
            src="/images/login-background.jpg"
            alt="background"
            fill
            style={{ objectFit: "cover" }}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          {authMode === "sign-in" && (
            <FadeInComponent>
              <Login navigateToSignUpHandler={() => setAuthMode("sign-up")} />
            </FadeInComponent>
          )}
          {authMode === "sign-up" && (
            <FadeInComponent>
              <Signup navigateToSignInHandler={() => setAuthMode("sign-in")} />
            </FadeInComponent>
          )}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
