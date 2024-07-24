import { useEffect } from "react";
import { FC } from "react";
import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";

const useStyles = makeStyles(() => ({
  countainerPrincipal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "2rem",
    overflow: "hidden",
    flexDirection: "column",
  },
  text1: {
    fontSize: "1.6rem",
    fontWeight: 400,
    color: theme.palette.primary.contrastText,
  },
}));

const Instagram: FC = () => {
  const classes = useStyles();

  useEffect(() => {
    // Cria o script e o adiciona ao DOM
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.setAttribute("data-use-service-core", "");
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Remove o script quando o componente é desmontado
      document.body.removeChild(script);
    };
  }, []); // O array vazio assegura que o useEffect só execute uma vez

  return (
    <div className={classes.countainerPrincipal}>
      <h2 className={classes.text1}>NOSSO INSTAGRAM</h2>
      <div
        className="elfsight-app-fa3cce2c-0b62-4540-8006-243f19d63006"
        data-elfsight-app-lazy
      ></div>
    </div>
  );
};

export default Instagram;
