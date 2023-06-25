import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createUserReq,
  getOrganizationUsers,
  getUserListReq,
} from "../../../api/api";
import { SnackbarsContext } from "../../../context/snackbars-context";
import { Box } from "@mui/material";
import { Role, User } from "../../../utils/interfaces";

enum ChangeType {
  ADD_MOVE = "add_move",
  REMOVE = "remove",
}

type Change = {
  type: ChangeType;
  userId: string;
  role?: Role;
};

type UserInOrg = {
  id: string;
  username: string;
  role: Role;
};

type Props = {
  orgId: string | null;
  handleClose: () => void;
};

export default function UsersInOrgModal(props: Props) {
  const { orgId, handleClose } = props;
  const { openSnackbar } = useContext(SnackbarsContext);
  const [members, setMembers] = useState<UserInOrg[]>([]);
  const [owners, setOwners] = useState<UserInOrg[]>([]);
  const [changes, setChanges] = useState<Change[]>([]);

  const { data: allUsers } = useQuery(["getUserList"], () => getUserListReq(), {
    select: (data) => {
      return data.data.users;
    },
  });

  const { data: organizationUsers } = useQuery(
    ["getOrganizationUsers", orgId],
    () => getOrganizationUsers(orgId!),
    {
      enabled: !!orgId && !!allUsers,
      select: (data) => {
        const formattedUsers = data.data.organization_users.map(
          (user: { user_id: string; role: Role }) => {
            const username = allUsers.find(
              (globalUser: User) => globalUser.id === user.user_id
            )?.username;
            return { id: user.user_id, username, role: user.role };
          }
        );

        return formattedUsers;
      },
    }
  );

  useEffect(() => {
    if (organizationUsers) {
      setMembers(
        organizationUsers.filter((user: UserInOrg) => user.role === Role.MEMBER)
      );
      setOwners(
        organizationUsers.filter((user: UserInOrg) => user.role === Role.OWNER)
      );
    }
  }, [organizationUsers]);

  const onSubmit = () => {
    handleClose();
  };

  return (
    <Dialog open={!!orgId} onClose={handleClose}>
      <Box noValidate component="form">
        <DialogTitle>Usuarios de la Organización</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: "12px" }}>
            Aquí podras editar los Usuarios de la Organización
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            disabled={changes.length === 0}
            onClick={onSubmit}
            type="button"
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
