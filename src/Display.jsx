import Testimonials from "./pages/Testimonials";
import Insights from "./pages/Insights";

export default function Display({ active }) {
  return (
    <div className="display-container">
      {active === "testimonials" && <Testimonials />}
      {active === "insights" && <Insights />}
    </div>
  );
}