import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";

const useStyles = makeStyles(() => ({
  divPrincipal: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
    padding: "18px 34px",
    fontSize: "1.5rem",
    fontWeight: "bold",
    backgroundColor: theme.palette.secondary.main,
    cursor: "pointer",
    border: `3px solid ${theme.palette.primary.main}`,
    "&:hover": {
      padding: "20px 38px",
    },
  },
}));

const CatalogoCompleto: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.divPrincipal}>
      <div className={classes.divButton}>
        <button
          onClick={() => {
            const phoneNumber = "5562984420366";
            window.open(`https://wa.me/${phoneNumber}`, "_blank");
          }}
          className={classes.button}
        >
          ACESSE CATÁLOGO COMPLETO
        </button>
      </div>
    </div>
  );
};

export default CatalogoCompleto;
