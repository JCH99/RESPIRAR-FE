import React, { useContext, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { signInReq } from "../../../api/api";
import { SnackbarsContext } from "../../../context/snackbars-context";
import RegisterModal from "./register-modal";
import { useRouter } from "next/router";
import { AuthContext } from "../../../context/auth-context";

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const Login = () => {
  const { openSnackbar } = useContext(SnackbarsContext);
  const { control, handleSubmit, watch } = useForm<FormData>();
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  const { mutate: signIn, isLoading } = useMutation(["loginUser"], signInReq, {
    onSuccess: async (data, variables) => {
      const token = data.headers["x-subject-token"];
      if (watch().rememberMe) {
        localStorage.setItem("token", token);
        sessionStorage.removeItem("token");
      } else {
        localStorage.removeItem("token");
        sessionStorage.setItem("token", token);
      }

      authContext?.setCurrentToken(token);
    },
    onError: (error: any) => {
      openSnackbar("Hubo un error. Ingrese los datos correctamente", "error");
    },
  });

  const onSubmit = (data: FormData) => {
    signIn({ name: data.email, password: data.password });
  };

  const signUpRedirectHandler = () => {
    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/sign_up/`);
    setOpenRegisterModal(false);
  };

  return (
    <>
      <RegisterModal
        open={openRegisterModal}
        handleClose={() => setOpenRegisterModal(false)}
        handleConfirm={signUpRedirectHandler}
      />
      <Box
        sx={{
          my: 8,
          mx: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          noValidate
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1 }}
        >
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: "El email es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "El Email es invalido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                error={!!error}
                helperText={error ? error.message : ""}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!error}
                helperText={error ? "La contraseña es requerida" : ""}
              />
            )}
          />
          <Controller
            name="rememberMe"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} color="primary" />}
                label="Remember me"
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? (
              <CircularProgress
                sx={{
                  color: (theme) => theme.palette.primary.contrastText,
                }}
                size={25}
                thickness={4}
              />
            ) : (
              "Sign In"
            )}
          </Button>
          <Grid container sx={{ display: "flex", justifyContent: "end" }}>
            <Grid item>
              <Button
                onClick={() => setOpenRegisterModal(true)}
                variant="text"
                size="small"
              >
                Don't have an account? Sign Up
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Login;
