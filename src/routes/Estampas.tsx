import { FC } from "react";
import PrintsCards from "../components/Prints/PrintsCard";
import CatalogoCompleto from "../components/Catalogo/CatalogoCompleto";

const Estampas: FC = () => {
  return (
    <div>
      <CatalogoCompleto />
      <PrintsCards />
    </div>
  );
};

export default Estampas;
