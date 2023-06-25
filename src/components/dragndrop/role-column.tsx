import React from "react";
import UserInOrg from "./user-in-org";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { IUserInOrg } from "../modals/users-in-org-modal";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

type Props = {
  col: {
    id: string;
    list: IUserInOrg[];
  };
  deleteUserHandler: (rol: string, userId: string) => void;
};

export default function RoleColumn(props: Props) {
  const {
    col: { id, list },
    deleteUserHandler,
  } = props;

  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <Box
          sx={{ width: 200, p: 1, minHeight: 200, position: "relative" }}
          component={Paper}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              justifyContent: "center",
              textTransform: "capitalize",
              mb: 0.5,
            }}
          >
            <Typography variant="h6" component="h3">
              {id}
            </Typography>
            <IconButton color="primary" onClick={() => console.log("TODO")}>
              <PersonAddIcon />
            </IconButton>
          </Box>
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {list.map((user, index) => (
                <UserInOrg
                  key={`${user.id}`}
                  user={user}
                  index={index}
                  deleteUserHandler={(userId: string) =>
                    deleteUserHandler(id, userId)
                  }
                />
              ))}
              {list.length === 0 && (
                <Draggable
                  draggableId={"droppable-placeholder-bugfix"}
                  index={0}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: 100,
                        }}
                      >
                        &nbsp;
                      </div>
                    </div>
                  )}
                </Draggable>
              )}
              {provided.placeholder}
            </Box>
          </div>
        </Box>
      )}
    </Droppable>
  );
}
