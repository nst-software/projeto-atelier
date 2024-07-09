import { FC } from "react";
import ImagemLogo from "../components/Home/ImagemLogo";
import BalaoDeTexto1 from "../components/Home/BalaoDeTexto1";
import BalaoDeTexto2 from "../components/Home/BalaoDeTexto2";

const Home: FC = () => {
  return (
    <div>
      <ImagemLogo />
      <BalaoDeTexto1 />
      <BalaoDeTexto2 />
      <h1>Welcome to the Home page!</h1>
    </div>
  );
};

export default Home;
