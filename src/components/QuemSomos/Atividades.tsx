import React from "react";
import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import Instagram from "@mui/icons-material/Instagram";
import useMediaQuery from "@mui/material/useMediaQuery";

const useStyles = makeStyles(() => ({
  containerPrincipal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  divCards: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "2rem",
    marginTop: "2rem",
    flexWrap: "wrap",
    width: "100%",
  },
  card: {
    backgroundColor: theme.palette.secondary.main,
    display: "flex",
    flexDirection: "column",

    alignItems: "center",
    gap: "1rem",
    width: "30%",
    height: "500px",
    borderRadius: "30px",

    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
      height: "200px",
    },
  },
  divIcon: {
    height: "30%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    marginTop: "-1rem",
    width: "80%",
    textAlign: "center",
    fontSize: "1.3vw",
    color: theme.palette.secondary.contrastText,
    [theme.breakpoints.down("sm")]: {
      width: "80%",
      marginTop: "-0.5rem",
      fontSize: "2.6vw",
    },
  },
}));

const Atividades: React.FC = () => {
  const classes = useStyles();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div className={classes.containerPrincipal}>
      <div className={classes.divCards}>
        <div className={classes.card}>
          <div className={classes.divIcon}>
            <Instagram
              style={{
                fontSize: isSmallScreen ? 50 : 100,
                color: theme.palette.secondary.contrastText,
              }}
            />
          </div>
          <p className={classes.texto}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic,
            laborum! Esse aut distinctio odit, magnam natus aliquid nam
            laudantium voluptas delectus velit possimus harum quia reiciendis
            sunt, enim sint quasi.Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Hic, laborum! Esse aut distinctio odit, magnam
            natus aliquid nam laudantium voluptas delectus velit possimus harum
            quia reiciendis sunt, enim sint quasi.
          </p>
        </div>
        <div className={classes.card}>
          <div className={classes.divIcon}>
            <Instagram
              style={{
                fontSize: isSmallScreen ? 50 : 100,
                color: theme.palette.secondary.contrastText,
              }}
            />
          </div>
          <p className={classes.texto}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic,
            laborum! Esse aut distinctio odit, magnam natus aliquid nam
            laudantium voluptas delectus velit possimus harum quia reiciendis
            sunt, enim sint quasi.Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Hic, laborum! Esse aut distinctio odit, magnam
            natus aliquid nam laudantium voluptas delectus velit possimus harum
            quia reiciendis sunt, enim sint quasi.
          </p>
        </div>
        <div className={classes.card}>
          <div className={classes.divIcon}>
            <Instagram
              style={{
                fontSize: isSmallScreen ? 50 : 100,
                color: theme.palette.secondary.contrastText,
              }}
            />
          </div>
          <p className={classes.texto}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic,
            laborum! Esse aut distinctio odit, magnam natus aliquid nam
            laudantium voluptas delectus velit possimus harum quia reiciendis
            sunt, enim sint quasi.Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Hic, laborum! Esse aut distinctio odit, magnam
            natus aliquid nam laudantium voluptas delectus velit possimus harum
            quia reiciendis sunt, enim sint quasi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Atividades;
