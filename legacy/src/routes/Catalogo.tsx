import { FC } from "react";
import Cards from "../components/Catalogo/Cards";
import CatalogoCompleto from "../components/Catalogo/CatalogoCompleto";

const Catalogo: FC = () => {
  return (
    <div>
      <CatalogoCompleto />
      <Cards />
    </div>
  );
};

export default Catalogo;
