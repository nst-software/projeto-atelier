import { FC } from "react";
import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import abstrata1 from "../../assets/IMG.jpg";

const abstratas = [
  {
    id: 1,
    name: "Abstratas 1",
    image: abstrata1,
  },
  {
    id: 2,
    name: "Abstratas 2",
    image: abstrata1,
  },
  {
    id: 3,
    name: "Abstratas 3",
    image: abstrata1,
  },
];

const useStyles = makeStyles(() => ({
  divPrincipal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
  },
  card: {
    margin: "2rem",
    marginTop: "2rem",
    marginBottom: "0",
    overflow: "hidden",
  },
  divCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "32%",
    [theme.breakpoints.down("sm")]: {
      width: "85%",
    },
  },
}));
/* Catalogo pra floral */
const Abstratas: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.divPrincipal}>
      <h1>Abstratas</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {abstratas.map((item) => (
          <div className={classes.divCard}>
            <div
              key={item.id}
              className={classes.card}
              style={{ borderRadius: "25px" }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "100%", overflow: "hidden" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Abstratas;
