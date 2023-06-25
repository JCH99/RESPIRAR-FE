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
import { useMutation } from "@tanstack/react-query";
import { createOrganizationReq, patchOrganizationReq } from "../../../api/api";
import { SnackbarsContext } from "../../../context/snackbars-context";

import { pick } from "lodash";

export enum OrganizationModalAction {
  CREATE = "create",
  PATCH = "patch",
}

export type OrganizationFormData = {
  name: string;
  description: string;
};

type Props = {
  action?: OrganizationModalAction;
  handleClose: () => void;
  organizationId?: string;
  organizationData?: OrganizationFormData;
  successCallback?: () => void;
};

export default function OrganizationModal(props: Props) {
  const {
    action,
    handleClose,
    organizationId,
    organizationData,
    successCallback,
  } = props;
  const { openSnackbar } = useContext(SnackbarsContext);

  const {
    control,
    handleSubmit,
    formState: { isDirty, dirtyFields },
    reset,
  } = useForm<OrganizationFormData>();

  useEffect(() => {
    if (action === OrganizationModalAction.CREATE) {
      reset({ name: "", description: "" });
    }
    if (action === OrganizationModalAction.PATCH) {
      reset(organizationData);
    }
  }, [action, organizationId, organizationData]);

  const { mutate: createOrganization } = useMutation(
    ["createOrganization"],
    createOrganizationReq,
    {
      onSuccess: async () => {
        openSnackbar("Se ha creado correctamente la organización!", "success");
        successCallback && successCallback();
      },
      onError: (error: any) => {
        openSnackbar("Hubo un error. Por favor intente luego", "error");
      },
    }
  );

  const { mutate: patchOrganization } = useMutation(
    ["patchOrganization"],
    patchOrganizationReq,
    {
      onSuccess: async () => {
        openSnackbar("Se editaron correctamente los datos!", "success");
        successCallback && successCallback();
      },
      onError: (error: any) => {
        openSnackbar("Hubo un error. Por favor intente luego", "error");
      },
    }
  );

  const onSubmit = (data: OrganizationFormData) => {
    if (action === OrganizationModalAction.CREATE) {
      createOrganization(data);
    }
    if (action === OrganizationModalAction.PATCH) {
      const filteredData = pick(data, Object.keys(dirtyFields));
      patchOrganization({
        organizationId: organizationId!,
        organizationData: filteredData,
      });
    }
    handleClose();
  };

  return (
    <Dialog open={!!action} onClose={handleClose}>
      <Box noValidate component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {action === OrganizationModalAction.CREATE ? "Crear" : "Editar"}{" "}
          Organización
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: "12px" }}>
            Aquí podras{" "}
            {action === OrganizationModalAction.CREATE
              ? "crear"
              : "editar los datos básicos de"}{" "}
            la organización.
          </DialogContentText>

          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nombre"
                autoFocus
                error={!!error}
                helperText={error ? "El nombre es requerido" : ""}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                multiline
                minRows={2}
                maxRows={5}
                inputProps={{ maxLength: 250 }}
                margin="normal"
                required
                fullWidth
                id="description"
                label="Descripcion"
                autoFocus
                error={!!error}
                helperText={error ? "La descripción es requerida" : ""}
              />
            )}
          />
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
