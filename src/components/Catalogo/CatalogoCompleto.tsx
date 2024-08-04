import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";

const useStyles = makeStyles(() => ({
  divPrincipal: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: theme.palette.secondary.main,
  },
  divButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "2rem",
    marginBottom: "2rem",
  },
  button: {
    color: theme.palette.secondary.contrastText,
    borderRadius: "40px",
    padding: "13px 28px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    backgroundColor: theme.palette.secondary.main,
    cursor: "pointer",
    border: `3px solid ${theme.palette.primary.main}`,
    "&:hover": {
      padding: "16px 32px",
    },
  },
}));

const CatalogoCompleto: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.divPrincipal}>
      <div className={classes.divButton}>
        <button className={classes.button}>ACESSE CATÁLOGO COMPLETO</button>
      </div>
    </div>
  );
};

export default CatalogoCompleto;
