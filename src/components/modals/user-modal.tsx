import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createUserReq, patchUserReq } from "../../../api/api";
import { SnackbarsContext } from "../../../context/snackbars-context";

import { pick } from "lodash";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export enum UserModalAction {
  CREATE = "create",
  PATCH = "patch",
}

export type UserFormData = {
  username: string;
  email: string;
  password?: string;
  repeatPassword?: string;
};

type Props = {
  action?: UserModalAction;
  handleClose: () => void;
  userId?: string;
  userData?: UserFormData;
  successCallback?: () => void;
};

export default function UserModal(props: Props) {
  const { action, handleClose, userId, userData, successCallback } = props;
  const { openSnackbar } = useContext(SnackbarsContext);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const {
    control,
    handleSubmit,
    formState: { isDirty, dirtyFields },
    reset,
  } = useForm<UserFormData>();

  useEffect(() => {
    reset(userData);
  }, [action, userId, userData]);

  const { mutate: createUser } = useMutation(["createUser"], createUserReq, {
    onSuccess: async () => {
      openSnackbar("Se ha creado correctamente el usuario!", "success");
      successCallback && successCallback();
    },
    onError: (error: any) => {
      openSnackbar("Hubo un error. Por favor intente luego", "error");
    },
  });

  const { mutate: patchUser } = useMutation(["patchUser"], patchUserReq, {
    onSuccess: async () => {
      openSnackbar("Se editaron correctamente los datos!", "success");
      successCallback && successCallback();
    },
    onError: (error: any) => {
      openSnackbar("Hubo un error. Por favor intente luego", "error");
    },
  });

  const onSubmit = (data: UserFormData) => {
    if (action === UserModalAction.CREATE) {
      createUser({
        username: data.username,
        email: data.email,
        password: data.password!,
      });
    }
    if (action === UserModalAction.PATCH) {
      const filteredData = pick(data, Object.keys(dirtyFields));
      patchUser({ userId: userId!, userData: filteredData });
    }

    handleClose();
  };

  return (
    <Dialog open={!!action} onClose={handleClose}>
      <Box noValidate component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: "12px" }}>
            Aquí podras editar los datos básicos del usuario.
          </DialogContentText>

          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                autoFocus
                error={!!error}
                helperText={error ? "El usuario es requerido" : ""}
              />
            )}
          />
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
                error={!!error}
                helperText={error ? error.message : ""}
              />
            )}
          />

          {action === UserModalAction.CREATE && (
            <>
              <Box sx={{ mt: "12px" }}>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="password">Contraseña</InputLabel>
                      <OutlinedInput
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        error={!!error}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Contraseña"
                      />
                      {error && (
                        <FormHelperText error id="password-error">
                          {error.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Box>

              <Box sx={{ mt: "18px" }}>
                <Controller
                  name="repeatPassword"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="repeatPassword">
                        Repetir Contraseña
                      </InputLabel>
                      <OutlinedInput
                        {...field}
                        id="repeatPassword"
                        type={showPassword ? "text" : "password"}
                        error={!!error}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Repetir Contraseña"
                      />
                      {error && (
                        <FormHelperText error id="password-error">
                          {error.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={handleClose}>
            Cancelar
          </Button>
          <Button disabled={!isDirty} type="submit">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
