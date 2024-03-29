import { useContext, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { User } from "../../../utils/interfaces";
import TableToolbar from "./table-toolbar";
import { Box, IconButton, Tooltip } from "@mui/material";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import UserModal, { UserFormData, UserModalAction } from "../modals/user-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserReq } from "../../../api/api";
import { SnackbarsContext } from "../../../context/snackbars-context";
import { AuthContext } from "../../../context/auth-context";

type Props = {
  users: User[];
};

export default function UserTable(props: Props) {
  const { users } = props;
  const queryClient = useQueryClient();
  const { openSnackbar } = useContext(SnackbarsContext);
  const [openProfileModal, setOpenProfileModal] = useState<{
    action: UserModalAction;
    userId?: string;
    userData?: UserFormData;
  } | null>(null);
  const authContext = useContext(AuthContext);

  const { mutate: deleteUser } = useMutation(["deleteUser"], deleteUserReq, {
    onSuccess: async () => {
      openSnackbar("Se elimino correctamente el usuario!", "success");
      editAndDeleteSuccessCallback();
    },
    onError: (error: any) => {
      openSnackbar("Hubo un error. Por favor intente luego", "error");
    },
  });

  const handleProfileModalClick = (profileModal: {
    userId: string;
    userData: UserFormData;
  }) => {
    setOpenProfileModal({ ...profileModal, action: UserModalAction.PATCH });
  };

  const handleCloseProfileModal = () => {
    setOpenProfileModal(null);
  };

  const editAndDeleteSuccessCallback = () => {
    queryClient.invalidateQueries(["getUserList"]);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableToolbar
          name="Usuarios"
          addHandler={() =>
            setOpenProfileModal({ action: UserModalAction.CREATE })
          }
          count={users.length}
        />

        <TableContainer
          sx={{
            borderTop: 1,
            borderColor: "grey.300",
            maxHeight: 500,
            overflowY: "auto",
          }}
        >
          <Table stickyHeader aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell width={"40%"}>Email</TableCell>
                <TableCell width={"40%"}>Username</TableCell>
                <TableCell align="center">Habilitado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => {
                const isCurrentUser = authContext?.user?.id === user.id;
                return (
                  <TableRow
                    key={`${user.id}-${index}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {user.email}
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell align="center">
                      {user.enabled ? (
                        <DoneAllIcon color="success" />
                      ) : (
                        <NotInterestedIcon color="warning" />
                      )}
                    </TableCell>
                    <TableCell
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <IconButton
                        onClick={() =>
                          handleProfileModalClick({
                            userId: user.id,
                            userData: {
                              username: user.username,
                              email: user.email,
                            },
                          })
                        }
                      >
                        <SettingsIcon />
                      </IconButton>
                      <Tooltip
                        arrow
                        title={
                          isCurrentUser
                            ? "No podes eliminarte a vos mismo!"
                            : ""
                        }
                      >
                        <span>
                          <IconButton
                            onClick={() => deleteUser(user.id)}
                            disabled={isCurrentUser}
                          >
                            <DeleteIcon
                              color={isCurrentUser ? "disabled" : "error"}
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <UserModal
        handleClose={handleCloseProfileModal}
        action={openProfileModal?.action}
        userId={openProfileModal?.userId}
        userData={openProfileModal?.userData}
        successCallback={editAndDeleteSuccessCallback}
      />
    </Box>
  );
}
