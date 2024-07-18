import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";

const useStyles = makeStyles(() => ({
  containerPrincipal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  text1: {
    fontSize: "1.6rem",
    fontWeight: 400,
    color: theme.palette.primary.contrastText,
  },
  divCards: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "2rem",
    marginTop: "2rem",
    flexWrap: "wrap",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    width: "230px",
    height: "300px",
    borderRadius: "10px",
    padding: "1rem",
    border: "1px solid black",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
}));

const SelosDeQualidade = () => {
  const classes = useStyles();

  return (
    <div className={classes.containerPrincipal}>
      <h2 className={classes.text1}>CERTIFICADOS</h2>
      <div className={classes.divCards}>
        <div className={classes.card}> </div>
        <div className={classes.card}> </div>
        <div className={classes.card}> </div>
      </div>
    </div>
  );
};

export default SelosDeQualidade;
