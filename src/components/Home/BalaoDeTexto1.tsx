import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";

const useStyles = makeStyles(() => ({
  containerPrincipal: {
    height: "20vh",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: theme.palette.secondary.main,
  },
  divText1: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  text1: {
    color: theme.palette.secondary.contrastText,
    fontSize: "1.5rem",
  },
  text2: {
    color: theme.palette.secondary.contrastText,
    fontSize: "2.5rem",
  },
}));

const BalaoDeTexto1 = () => {
  const classes = useStyles();

  return (
    <div className={classes.containerPrincipal}>
      <div className={classes.divText1}>
        <p className={classes.text1}>Nova coleção</p>
      </div>
      <div className={classes.divText1}>
        <p className={classes.text2}>Lorem ipsum</p>
      </div>
      <div className={classes.divText1}>
        <p className={classes.text1}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil eos
          velit recusandae ducimus.
        </p>
      </div>
    </div>
  );
};

export default BalaoDeTexto1;
