import { useEffect, useRef, useState } from "react";
import { FaCommentDots, FaChartLine } from "react-icons/fa";

export default function SideNav({ setActive, active }) {
  const sidebarRef = useRef(null);
  const [arrowTop, setArrowTop] = useState(0);

  const navItems = [
    { id: "testimonials", icon: <FaCommentDots /> },
    { id: "insights", icon: <FaChartLine /> },
  ];

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const activeEl = sidebar.querySelector(".nav-item.active");
    if (activeEl) {
      const sidebarRect = sidebar.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      setArrowTop(itemRect.top - sidebarRect.top + itemRect.height / 2 - 10); // 10px = half arrow height
    }
  }, [active]);

  return (
    <div className="sidebar" ref={sidebarRef}>
      {/* Rounded arrow next to the right of sidebar */}
      <span className="active-arrow" style={{ top: arrowTop }}></span>

      {navItems.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${active === item.id ? "active" : ""}`}
          onClick={() => setActive(item.id)}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
}