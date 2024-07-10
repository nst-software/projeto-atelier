import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";

const useStyles = makeStyles(() => ({
  containerPrincipal: {
    minHeight: "20vh",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: theme.palette.secondary.main,
  },
  divText1: {
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginLeft: "5%",
  },
  text1: {
    color: theme.palette.secondary.contrastText,
    fontSize: "1.5rem",
  },
  divText2: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  text2: {
    color: theme.palette.secondary.contrastText,
    fontSize: "2.5rem",
  },
  divText3: {
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginRight: "5%",
  },
  text3: {
    color: theme.palette.secondary.contrastText,
    fontSize: "0.8rem",
  },
}));

const BalaoDeTexto1 = () => {
  const classes = useStyles();

  return (
    <div className={classes.containerPrincipal}>
      <div className={classes.divText1}>
        <p className={classes.text1}>Nova coleção</p>
      </div>
      <div className={classes.divText2}>
        <p className={classes.text2}>Lorem ipsum</p>
      </div>
      <div className={classes.divText3}>
        <p className={classes.text3}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil eos
          velit recusandae ducimus.
        </p>
      </div>
    </div>
  );
};

export default BalaoDeTexto1;
