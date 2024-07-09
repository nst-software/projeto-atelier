import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";

const useStyles = makeStyles(() => ({
  containerPrincipal: {
    height: "20vh",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: theme.palette.primary.main,
  },
  divText1: {
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  text1: {
    color: theme.palette.primary.contrastText,
    fontSize: "1.5rem",
  },
}));

const BalaoDeTexto1 = () => {
  const classes = useStyles();

  return (
    <div className={classes.containerPrincipal}>
      <div className={classes.divText1}>
        <p className={classes.text1}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis
          placeat magni magnam accusantium minima distinctio culpa repellendus
          eius mollitia ipsam praesentium blanditiis!
        </p>
      </div>
    </div>
  );
};

export default BalaoDeTexto1;
