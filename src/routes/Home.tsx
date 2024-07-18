import { FC } from "react";
import ImagemLogo from "../components/Home/ImagemLogo";
import BalaoDeTexto1 from "../components/Home/BalaoDeTexto1";
import BalaoDeTexto2 from "../components/Home/BalaoDeTexto2";
import QuemSomos from "../components/Home/QuemSomos";
import SelosDeQualidade from "../components/Home/SelosDeQualidade";

const Home: FC = () => {
  return (
    <div>
      <ImagemLogo />
      <BalaoDeTexto1 />
      <BalaoDeTexto2 />
      <QuemSomos />
      <SelosDeQualidade />
    </div>
  );
};

export default Home;
