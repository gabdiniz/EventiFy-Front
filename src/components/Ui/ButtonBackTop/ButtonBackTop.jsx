import React, { useState, useEffect } from "react";
import "./ButtonBackTop.scss";

export function ButtonBackTop({ scrollOffset = 200 }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > scrollOffset) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollOffset]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    showButton && (
      <button className="back-to-top-button" onClick={scrollToTop}>
        Voltar ao Topo
      </button>
    )
  );
}
