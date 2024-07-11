import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { Footer } from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <div style={{ marginTop: "110px" }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
