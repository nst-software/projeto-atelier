import React from "react";
import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import logoRedonda from "../../assets/ATELIER-LOGO.png";

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
    width: "300px",
    height: "420px",
    borderRadius: "30px",
    padding: "1rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  divImg: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80px",
  },
  divText: {
    display: "flex",
    flexDirection: "column",
    marginTop: "-2rem",

    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: theme.palette.secondary.contrastText,
    fontSize: "1rem",
    fontWeight: 100,
    textAlign: "center",
    listStyle: "none",
  },
  logo: {
    width: "70px",
    height: "70px",
  },
}));

const NossasAtividades: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.containerPrincipal}>
      <div className={classes.divCards}>
        <div className={classes.card}>
          <div className={classes.divImg}>
            <img src={logoRedonda} className={classes.logo} />
          </div>
          <div className={classes.divText}>
            <ul
              className={classes.text}
              style={{ marginLeft: "-20px", marginRight: "10px" }}
            >
              <h2>Nossos Valores</h2>
              <li>
                <strong>Qualidade</strong>: Tecidos selecionados com o mais alto
                padrão de excelência.
              </li>
              <li>
                <strong>Criatividade</strong>: Estampas únicas que permitem
                expressar estilo de forma autêntica.
              </li>
              <li>
                <strong>Sustentabilidade</strong>: Compromisso com práticas
                responsáveis e materiais ecologicamente corretos.
              </li>
              <li>
                <strong>Atendimento</strong>: Foco em oferecer uma experiência
                excepcional aos nossos clientes.
              </li>
              <li>
                <strong>Inovação</strong>: Constantemente buscando novas
                tendências e soluções no mundo da moda e design.
              </li>
            </ul>
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.divImg}>
            <img src={logoRedonda} className={classes.logo} />
          </div>
          <div className={classes.divText}>
            <h2 style={{ color: "white", marginTop: "35px" }}>Nossoa Missão</h2>
            <p className={classes.text} style={{ marginTop: "0" }}>
              Nossa missão é proporcionar tecidos de alta qualidade que inspirem
              criatividade e inovação no mundo da moda. Comprometemo-nos a
              atender às necessidades de nossos clientes com soluções
              personalizadas, sempre respeitando práticas sustentáveis e
              promovendo o bem-estar das comunidades que impactamos. Buscamos a
              excelência em cada etapa do nosso processo, desde a seleção de
              matérias-primas até a entrega final, garantindo que nossos
              produtos não apenas atendam, mas superem as expectativas dos
              nossos parceiros.
            </p>
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.divImg}>
            <img src={logoRedonda} className={classes.logo} />
          </div>
          <div className={classes.divText}>
            <h2 style={{ color: "white", marginTop: "35px" }}>Nossoa Visão</h2>
            <p className={classes.text} style={{ marginTop: "0" }}>
              Ser reconhecida como a principal referência em tecidos de
              qualidade e inovação, liderando o mercado com soluções criativas e
              sustentáveis. Aspiramos a ser a escolha preferida de estilistas,
              fabricantes e consumidores que buscam não apenas beleza, mas
              também responsabilidade ambiental e social em seus produtos. Nossa
              visão é transformar a indústria têxtil, promovendo a
              conscientização sobre práticas sustentáveis e estabelecendo
              padrões de excelência que inspirem outros a seguir o mesmo
              caminho.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NossasAtividades;
