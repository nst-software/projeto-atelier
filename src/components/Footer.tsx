import { makeStyles } from "@mui/styles";
import { theme } from "../Style/Theme";
import logo from "../assets/ATELIER-LOGO.png";
import { Routes } from "../utils/enums/Routes";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InstagramIcon from "@mui/icons-material/Instagram";
import { WhatsApp } from "@mui/icons-material";

const useStyles = makeStyles(() => ({
  divPrincipal: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  footer: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  divRotes: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
    width: "30%",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  divlogo: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
    width: "30%",
    [theme.breakpoints.down("sm")]: {
      width: "50%",
    },
  },
  divInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "normal",
    width: "30%",
    [theme.breakpoints.down("sm")]: {
      width: "50%",
    },
  },
  logo: {
    width: "60%",
  },
  separator: {
    width: "75%",
    borderTop: `1px solid ${theme.palette.primary.contrastText}`,
    margin: "20px 0",
  },
}));

export const Footer = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  return (
    <div className={classes.divPrincipal}>
      <div className={classes.separator}></div>
      <footer className={classes.footer}>
        <div className={classes.divlogo}>
          <img src={logo} alt="Logo" className={classes.logo} />
        </div>
        <div className={classes.divRotes}>
          {Routes.values.map((page) => (
            <Button
              variant="text"
              size="large"
              key={page}
              onClick={() => navigate(`/${page}`)}
            >
              <Typography
                color={theme.palette.primary.contrastText}
                fontWeight={200}
              >
                {Routes.getLabel(page)}
              </Typography>
            </Button>
          ))}
        </div>
        <div className={classes.divInfo}>
          <p>Endereço: Rua das Flores, 123</p>
          <p>cep: 99999-999</p>
          <p>Telefone:(99)99999-9999</p>
          <p>Email:email@trademail.com</p>
          <div>
            <InstagramIcon />
            <WhatsApp />
          </div>
        </div>
      </footer>
      <div className={classes.separator}></div>
      <p>© 2024 - Todos os direitos reservados</p>
    </div>
  );
};
