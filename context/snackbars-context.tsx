import { createContext, useState, forwardRef, ReactNode } from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

type ContextType = {
  openSnackbar: (message: string, severity: SeverityType) => void;
};

export const SnackbarsContext = createContext<ContextType>({
  openSnackbar: () => {},
});

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type SeverityType = "info" | "success" | "error" | "warning";

const SnackbarsProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<SeverityType>("success");

  const handleClick = (message: string, severity: SeverityType) => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <SnackbarsContext.Provider value={{ openSnackbar: handleClick }}>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarsContext.Provider>
  );
};

export default SnackbarsProvider;
