import { useContext, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Controller, useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchUserReq } from "../../../api/api";
import { SnackbarsContext } from "../../../context/snackbars-context";
import { AuthContext } from "../../../context/auth-context";

type FormData = {
  username: string;
  email: string;
};

type Props = {
  open: boolean;
  handleClose: () => void;
  userData: FormData;
};

export default function ProfileModal(props: Props) {
  const { open, handleClose, userData } = props;
  const { openSnackbar } = useContext(SnackbarsContext);
  const authCtx = useContext(AuthContext);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
    reset,
  } = useForm<FormData>({
    defaultValues: userData,
  });

  useEffect(() => {
    reset();
  }, [open]);

  const { mutate: patchUser } = useMutation(["patchUser"], patchUserReq, {
    onSuccess: async () => {
      openSnackbar("Se editaron correctamente los datos!", "success");
      queryClient.invalidateQueries(["getUserInfoViaToken", authCtx?.token]);
    },
    onError: (error: any) => {
      openSnackbar("Hubo un error. Por favor intente luego", "error");
    },
    onSettled: () => {
      handleClose();
    },
  });

  const onSubmit = (data: FormData) => {
    patchUser({ userId: authCtx!.user!.id, userData: data });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box noValidate component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: "12px" }}>
            Aquí podras editar los datos básicos de tu usuario.
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
                helperText={error ? "Username is required" : ""}
              />
            )}
          />
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
                error={!!error}
                helperText={error ? "Email is required" : ""}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={handleClose}>
            Cancelar
          </Button>
          <Button disabled={!isDirty || !isValid} type="submit">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
