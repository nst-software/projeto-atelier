import { FC } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  IconButton,
  Drawer,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Routes } from "../utils/enums/Routes";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { theme } from "../Style/Theme";
import logo from "../assets/LogoEscrita.pdf";

const useStyles = makeStyles(() => ({
  headerLogo: {
    height: "150px",
    cursor: "pointer",
  },

  headerAppBar: {
    // TODO: Change to use theme
    backgroundColor: theme.palette.primary.main,
    margin: 0,
    padding: 0,
    maxHeight: "110px",
    boxShadow:
      "rgba(255, 255, 255 ,0.3) 0px 1px 2px 0px, rgba(255, 255, 255 ,0.15) 0px 2px 6px 2px",
  },
  headerTollbar: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 0,
    padding: 0,
  },
  headerButton: {
    color: "white",
    display: "block",
  },
  drawerPaper: {
    width: "100%",
    height: "100vh",
    // TODO: Change to use theme
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerItem: {
    color: theme.palette.primary.contrastText,
    padding: "12px",
    width: "100%",
    fontSize: "18px",
  },
}));

const Header: FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div className={classes.drawerPaper}>
      {Routes.values.map((page) => (
        <Button
          variant="text"
          size="large"
          key={page}
          onClick={() => navigate(`/${page}`)}
          className={classes.drawerItem}
        >
          <Typography
            color={theme.palette.primary.contrastText}
            fontWeight={600}
          >
            {Routes.getLabel(page)}
          </Typography>
        </Button>
      ))}
      <ArrowBackIcon
        sx={{
          color: theme.palette.primary.contrastText,
          cursor: "pointer",
          position: "absolute",
          top: "16px", // Ajuste conforme necessário
          left: "16px",
          fontSize: "2rem",
        }}
      />
    </div>
  );

  return (
    <AppBar position="static" className={classes.headerAppBar}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        classes={{
          paper: classes.drawerPaper,
        }}
        sx={{ display: { xs: "block", md: "none" } }}
        onClick={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
      <Toolbar className={classes.headerTollbar}>
        <img
          src={logo}
          className={classes.headerLogo}
          onClick={() => navigate(`/`)}
        />
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          {Routes.values.map((page) => (
            <Button
              className={classes.headerButton}
              key={page}
              onClick={() => navigate(`/${page}`)}
              sx={{ mx: 2, color: "white" }}
            >
              <Typography
                color={theme.palette.primary.contrastText}
                fontWeight={400}
                fontSize="18px"
              >
                {Routes.getLabel(page)}
              </Typography>
            </Button>
          ))}
        </Box>
        <IconButton
          size="large"
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ ml: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
