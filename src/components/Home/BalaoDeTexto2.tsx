import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";

const useStyles = makeStyles(() => ({
  containerPrincipal: {
    minHeight: "20vh",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: theme.palette.primary.main,
  },
  divText1: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    width: "80%",
    padding: "3%",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  text1: {
    color: theme.palette.primary.contrastText,
    fontSize: "2rem",
    maxFontSize: "2.5vw",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5rem",
    },
  },
}));

const BalaoDeTexto1 = () => {
  const classes = useStyles();

  return (
    <div className={classes.containerPrincipal}>
      <div className={classes.divText1}>
        <p className={classes.text1}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis
          placeat magni magnam accusantium minima distinctio culpa.
        </p>
      </div>
    </div>
  );
};

export default BalaoDeTexto1;
