import { useState } from "react";
import SideNav from "./components/SideNav";
import TopBar from "./components/Topbar";
import Display from "./Display";

function App() {
  const [active, setActive] = useState("testimonials");

  return (
    <>
      <TopBar />
      <SideNav setActive={setActive} active={active} />
      <Display active={active} />
    </>
  );
}

export default App;