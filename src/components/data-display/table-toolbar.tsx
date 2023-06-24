import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { Badge, Button } from "@mui/material";

type Props = {
  name: string;
  count: number;
  addHandler: () => void;
};

export default function TableToolbar(props: Props) {
  const { name, count, addHandler } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Badge badgeContent={count} color="primary">
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {name}
        </Typography>
      </Badge>

      <Button onClick={addHandler} variant="outlined" startIcon={<AddIcon />}>
        Agregar
      </Button>
    </Toolbar>
  );
}
