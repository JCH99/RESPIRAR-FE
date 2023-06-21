import React, { useContext } from "react";
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
import { signInReq } from "../../../api/auth";
import { SnackbarsContext } from "../../../context/snackbars-context";
import { useRouter } from "next/router";

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type Props = {};

const Login = ({}: Props) => {
  const { openSnackbar } = useContext(SnackbarsContext);
  const { control, handleSubmit } = useForm<FormData>();
  const router = useRouter();

  const { mutate: signIn, isLoading } = useMutation(["loginUser"], signInReq, {
    onSuccess: async (data, variables) => {
      console.log(data.headers["X-Subject-Token"]);
      router.push(`${process.env.NEXT_PUBLIC_BASE_URL as string}/idm`);
    },
    onError: (error: any) => {
      openSnackbar(error.message, "error");
    },
  });

  const onSubmit = (data: FormData) => {
    signIn({ name: data.email, password: data.password });
  };

  return (
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
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 1 }}
      >
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{ required: true }}
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
              helperText={error ? "Email is required" : ""}
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
              helperText={error ? "Password is required" : ""}
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
        <Grid
          onClick={() => console.log("TODO")}
          container
          sx={{ display: "flex", justifyContent: "end" }}
        >
          <Grid item>
            <Link href="#" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Login;
