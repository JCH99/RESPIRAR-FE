import { useContext, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Controller, useForm } from "react-hook-form";
import { Box, FormControlLabel, FormGroup, Switch } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchUserReq } from "../../../api/api";
import { SnackbarsContext } from "../../../context/snackbars-context";
import { AuthContext } from "../../../context/auth-context";
import { pick } from "lodash";

export type ProfileFormData = {
  username: string;
  email: string;
  enabled: boolean;
};

type Props = {
  handleClose: () => void;
  userId?: string;
  userData?: ProfileFormData;
  hideEnableToggle?: boolean;
  successCallback?: () => void;
};

export default function ProfileModal(props: Props) {
  const { handleClose, userId, userData, hideEnableToggle, successCallback } =
    props;
  const { openSnackbar } = useContext(SnackbarsContext);

  const {
    control,
    handleSubmit,
    formState: { isDirty, dirtyFields },
    reset,
  } = useForm<ProfileFormData>();

  useEffect(() => {
    reset(userData);
  }, [userId, userData]);

  const { mutate: patchUser } = useMutation(["patchUser"], patchUserReq, {
    onSuccess: async () => {
      openSnackbar("Se editaron correctamente los datos!", "success");
      successCallback && successCallback();
    },
    onError: (error: any) => {
      openSnackbar("Hubo un error. Por favor intente luego", "error");
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    const filteredData = pick(data, Object.keys(dirtyFields));
    patchUser({ userId: userId!, userData: filteredData });
    handleClose();
  };

  return (
    <Dialog open={!!userId && !!userData} onClose={handleClose}>
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
          {!hideEnableToggle && (
            <Controller
              name="enabled"
              control={control}
              render={({ field }) => (
                <Box>
                  <FormControlLabel
                    id="enabled"
                    control={
                      <Switch checked={field.value} onChange={field.onChange} />
                    }
                    label="Habilitado"
                  />
                </Box>
              )}
            />
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
