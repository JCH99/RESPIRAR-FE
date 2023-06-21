import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type Props = {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
};

export default function RegisterModal({
  open,
  handleClose,
  handleConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Registrar nuevo usuario</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Serás redirigido a la vista de registro de nuevo usuario. Una vez
          creado el usuario, el mismo deberá ser habilitado por un
          administrador. Luego podrás volver aquí y loguearte.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleConfirm} autoFocus>
          Crear usuario
        </Button>
      </DialogActions>
    </Dialog>
  );
}
