import { FaCommentDots, FaChartLine } from "react-icons/fa";

export default function SideNav({ setActive, active }) {
  return (
    <div className="sidebar">
      <div
        className={`nav-item ${active === "testimonials" ? "active" : ""}`}
        onClick={() => setActive("testimonials")}
      >
        <FaCommentDots />
      </div>

      <div
        className={`nav-item ${active === "insights" ? "active" : ""}`}
        onClick={() => setActive("insights")}
      >
        <FaChartLine />
      </div>
    </div>
  );
}