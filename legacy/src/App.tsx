import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { Footer } from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <Header />
      <div style={{ marginTop: "110px" }}>
        <ScrollToTop />
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
