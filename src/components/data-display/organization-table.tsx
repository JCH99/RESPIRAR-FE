import { useContext, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Organization, Role } from "../../../utils/interfaces";
import TableToolbar from "./table-toolbar";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQueryClient } from "@tanstack/react-query";
import { SnackbarsContext } from "../../../context/snackbars-context";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PersonIcon from "@mui/icons-material/Person";

type Props = {
  organizations: Organization[];
};

export default function OrganizationTable(props: Props) {
  const { organizations } = props;
  const queryClient = useQueryClient();
  const { openSnackbar } = useContext(SnackbarsContext);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableToolbar
          name="Organizaciones"
          addHandler={() => console.log("TODO")}
          count={organizations.length}
        />

        <Box sx={{ borderTop: 1, borderColor: "grey.300" }}>
          <Table aria-label="organizations table">
            <TableHead>
              <TableRow>
                <TableCell width={"40%"}>Nombre</TableCell>
                <TableCell width={"40%"}>Descripcion</TableCell>
                <TableCell align="center">Rol</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {organizations.map((organization, index) => (
                <TableRow
                  key={`${organization.Organization.id}-${index}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {organization.Organization.name}
                  </TableCell>
                  <TableCell>{organization.Organization.description}</TableCell>
                  <TableCell align="center">
                    {organization.role === Role.OWNER && (
                      <Chip
                        icon={<EngineeringIcon />}
                        label="Owner"
                        variant="outlined"
                      />
                    )}
                    {organization.role === Role.MEMBER && (
                      <Chip
                        icon={<PersonIcon />}
                        label="Member"
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ display: "flex", justifyContent: "center" }}>
                    <Tooltip
                      arrow
                      title={
                        organization.role !== Role.OWNER
                          ? "Solo Owners pueden editar la organización"
                          : ""
                      }
                    >
                      <IconButton disabled={organization.role !== Role.OWNER}>
                        <SettingsIcon onClick={() => console.log("TODO")} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      arrow
                      title={
                        organization.role !== Role.OWNER
                          ? "Solo Owners pueden eliminar la organización"
                          : ""
                      }
                    >
                      <IconButton disabled={organization.role !== Role.OWNER}>
                        <DeleteIcon
                          onClick={() => console.log("TODO")}
                          color={
                            organization.role === Role.OWNER
                              ? "error"
                              : "disabled"
                          }
                        />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}
