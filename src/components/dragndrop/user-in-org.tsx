import { Draggable } from "react-beautiful-dnd";
import { IUserInOrg } from "../modals/users-in-org-modal";
import Chip from "@mui/material/Chip";

type Props = {
  user: IUserInOrg;
  index: number;
  deleteUserHandler?: (userId: string) => void;
};

export default function UserInOrg(props: Props) {
  const { index, user, deleteUserHandler } = props;
  return (
    <Draggable draggableId={user.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Chip
            sx={{ m: 0.2, cursor: "pointer" }}
            label={user.username}
            variant="outlined"
            onDelete={
              deleteUserHandler ? () => deleteUserHandler(user.id) : undefined
            }
          />
        </div>
      )}
    </Draggable>
  );
}
