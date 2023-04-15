import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import Image from "../public/images/login-background.jpg";
import Image from "next/image";
import Login from "../src/components/auth/login";
import Signup from "../src/components/signup";

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
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {authMode === "sign-in" && (
              <Login navigateToSignUpHandler={() => setAuthMode("sign-up")} />
            )}
            {authMode === "sign-up" && (
              <Signup navigateToSignInHandler={() => setAuthMode("sign-in")} />
            )}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
