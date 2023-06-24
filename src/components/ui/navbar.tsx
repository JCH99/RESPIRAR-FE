import { useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useRouter } from "next/router";
import { AuthContext } from "../../../context/auth-context";
import { Box } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import ProfileModal, { ProfileFormData } from "../profile-modal";
import { useQueryClient } from "@tanstack/react-query";

type Props = {};

const Navbar = (props: Props) => {
  const queryClient = useQueryClient();
  const authCtx = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openProfileModal, setOpenProfileModal] = useState<{
    userId: string;
    userData: ProfileFormData;
  } | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileModalClick = () => {
    setAnchorEl(null);
    setOpenProfileModal({
      userId: authCtx!.user!.id!,
      userData: {
        username: authCtx!.user!.username,
        email: authCtx!.user!.email,
        enabled: authCtx!.user!.enabled,
      },
    });
  };

  const handleCloseProfileModal = () => {
    setOpenProfileModal(null);
  };

  const editSuccessCallback = () => {
    queryClient.invalidateQueries(["getUserInfoViaToken", authCtx?.token]);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
          RespirAR
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Typography variant="body1" component="h3" sx={{ flexGrow: 1 }}>
            {authCtx?.user?.username || authCtx?.user?.email}
          </Typography>
          <IconButton
            id="profile-header-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleMenuClick}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="profile-header-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleProfileModalClick}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Editar Perfil</ListItemText>
            </MenuItem>
            <MenuItem onClick={authCtx?.logout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Salir</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      <ProfileModal
        handleClose={handleCloseProfileModal}
        userId={openProfileModal?.userId}
        userData={openProfileModal?.userData}
        hideEnableToggle
        successCallback={editSuccessCallback}
      />
    </AppBar>
  );
};

export default Navbar;
