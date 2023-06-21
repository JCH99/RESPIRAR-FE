import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Login from "../src/components/auth/login";
import { FadeInComponent } from "../src/components/animations";

export default function SignInSide() {
  return (
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
        <FadeInComponent>
          <Login />
        </FadeInComponent>
      </Grid>
    </Grid>
  );
}
