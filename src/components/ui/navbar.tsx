import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useRouter } from "next/router";

type Props = {};

const Navbar = (props: Props) => {
  const router = useRouter();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
          RespirAR
        </Typography>

        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={() => router.push("/profile")}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
