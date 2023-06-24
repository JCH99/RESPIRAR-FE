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
import { Box, IconButton } from "@mui/material";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import ProfileModal, { ProfileFormData } from "../profile-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserReq } from "../../../api/api";
import { SnackbarsContext } from "../../../context/snackbars-context";

type Props = {
  users: User[];
};

export default function UserTable(props: Props) {
  const { users } = props;
  const queryClient = useQueryClient();
  const { openSnackbar } = useContext(SnackbarsContext);
  const [openProfileModal, setOpenProfileModal] = useState<{
    userId: string;
    userData: ProfileFormData;
  } | null>(null);

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
    userData: ProfileFormData;
  }) => {
    setOpenProfileModal(profileModal);
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
          addHandler={() => console.log("TODO")}
          count={users.length}
        />

        <Box sx={{ borderTop: 1, borderColor: "grey.300" }}>
          <Table aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell width={"40%"}>Email</TableCell>
                <TableCell width={"40%"}>Username</TableCell>
                <TableCell align="center">Habilitado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
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
                  <TableCell sx={{ display: "flex", justifyContent: "center" }}>
                    <IconButton>
                      <SettingsIcon
                        onClick={() =>
                          handleProfileModalClick({
                            userId: user.id,
                            userData: {
                              username: user.username,
                              email: user.email,
                              enabled: user.enabled,
                            },
                          })
                        }
                      />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon
                        onClick={() => deleteUser(user.id)}
                        color="error"
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      <ProfileModal
        handleClose={handleCloseProfileModal}
        userId={openProfileModal?.userId}
        userData={openProfileModal?.userData}
        successCallback={editAndDeleteSuccessCallback}
      />
    </Box>
  );
}
