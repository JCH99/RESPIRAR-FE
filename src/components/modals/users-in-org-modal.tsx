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
import RoleColumb from "../dragndrop/role-column";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { cloneDeep, differenceBy } from "lodash";

function filterUniqueChanges(changes: Change[]): Change[] {
  const uniqueChanges: { [userId: string]: Change } = {};

  for (const change of changes) {
    uniqueChanges[change.userId] = change;
  }

  return Object.values(uniqueChanges);
}

enum ChangeType {
  ADD_MOVE = "add_move",
  REMOVE = "remove",
}

type Change = {
  type: ChangeType;
  userId: string;
  role?: Role;
};

export type IUserInOrg = {
  id: string;
  username: string;
  role?: Role;
};

type Props = {
  orgId: string | null;
  handleClose: () => void;
};

export default function UsersInOrgModal(props: Props) {
  const { orgId, handleClose } = props;
  const { openSnackbar } = useContext(SnackbarsContext);

  const initialColumns = {
    agregables: {
      id: "agregables",
      list: [],
    },
    members: {
      id: "members",
      list: [],
    },
    owners: {
      id: "owners",
      list: [],
    },
  };

  const [columns, setColumns] = useState<{
    [key: string]: {
      id: string;
      list: IUserInOrg[];
    };
  }>(initialColumns);

  const [changes, setChanges] = useState<Change[]>([]);
  useEffect(() => {
    setChanges([]);
  }, [orgId]);

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
      const agregables = differenceBy(
        allUsers,
        organizationUsers,
        "id"
      ) as any as User[];
      const formattedAgregables = agregables.map((user: User) => {
        return { id: user.id, username: user.username };
      });

      const members = organizationUsers.filter(
        (user: IUserInOrg) => user.role === Role.MEMBER
      );
      const owners = organizationUsers.filter(
        (user: IUserInOrg) => user.role === Role.OWNER
      );

      setColumns({
        agregables: {
          id: "agregables",
          list: formattedAgregables,
        },
        members: {
          id: "members",
          list: members,
        },
        owners: {
          id: "owners",
          list: owners,
        },
      });
    }
  }, [organizationUsers, allUsers]);

  const onDragEnd = ({ source, destination }: DropResult) => {
    // Make sure we have a valid destination
    if (destination === undefined || destination === null) return null;

    // Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null;

    // Set start and end variables
    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];

    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = start.list.filter(
        (_: any, idx: number) => idx !== source.index
      );

      // Then insert the item at the right location
      newList.splice(destination.index, 0, start.list[source.index]);

      // Then create a new copy of the column object
      const newCol = {
        id: start.id,
        list: newList,
      };

      // Update the state
      setColumns((state) => ({ ...state, [newCol.id]: newCol }));
      return null;
    } else {
      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      const newStartList = start.list.filter(
        (_: any, idx: number) => idx !== source.index
      );

      // Create a new start column
      const newStartCol = {
        id: start.id,
        list: newStartList,
      };

      // Make a new end list array
      const newEndList = end.list;

      // Insert the item into the end list
      newEndList.splice(destination.index, 0, start.list[source.index]);

      // Create a new end column
      const newEndCol = {
        id: end.id,
        list: newEndList,
      };

      // Dispatch the change event
      const destinationId = destination.droppableId;
      const userMoved = columns[source.droppableId].list[source.index];

      if (destinationId === "owners" || destinationId === "members") {
        const newRole = destinationId === "owners" ? "owner" : "member";
        setChanges((prev) => {
          return [
            ...prev,
            {
              type: ChangeType.ADD_MOVE,
              userId: userMoved.id,
              role: newRole as Role,
            },
          ];
        });
      }
      if (destinationId === "agregables") {
        setChanges((prev) => {
          return [
            ...prev,
            {
              type: ChangeType.REMOVE,
              userId: userMoved.id,
            },
          ];
        });
      }

      // Update the state
      setColumns((state) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      }));
      return null;
    }
  };

  const deleteUserHandler = (rol: string, userId: string) => {
    setChanges((prev) => {
      return [
        ...prev,
        {
          type: ChangeType.REMOVE,
          userId: userId,
        },
      ];
    });

    setColumns((prevState) => {
      const newState = cloneDeep(prevState);
      const userIndex = newState[rol].list.findIndex(
        (item) => item.id === userId
      );
      const removedUser = newState[rol].list.splice(userIndex, 1)[0];
      newState["agregables"].list.push(removedUser);
      return newState;
    });
  };

  const onSubmit = () => {
    const lastChangesById = filterUniqueChanges(changes);
    console.log(lastChangesById);
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
          <DragDropContext onDragEnd={onDragEnd}>
            <Box sx={{ display: "flex", alignItems: "start", gap: 4 }}>
              {Object.values(columns).map((col, index) => (
                <RoleColumb
                  col={col}
                  key={col.id}
                  deleteUserHandler={deleteUserHandler}
                />
              ))}
            </Box>
          </DragDropContext>
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