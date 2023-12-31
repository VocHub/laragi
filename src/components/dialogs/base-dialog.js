import React, { isValidElement } from "react";
import {
  AppBar,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export const BaseDialog = ({
  open = false,
  onClose,
  title,
  children,
  titleStyles = {},
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isElement = isValidElement(title);

  return (
    <Dialog fullScreen={smDown} open={open} onClose={onClose}>
      <DialogTitle sx={{ padding: 0, ...titleStyles }}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
            {!isElement ? (
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {title}
              </Typography>
            ) : (
              title
            )}
          </Toolbar>
        </AppBar>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};
