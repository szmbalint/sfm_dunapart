import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom"; // React Router importálása

const FloatingMenu = () => {
  const menuRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ left: 30, top: 350 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(() => {
    // LocalStorage-ból olvassuk ki a nyitottság állapotát
    const savedState = localStorage.getItem("floatingMenuState");
    return savedState ? JSON.parse(savedState).isOpen : true; // Alapértelmezett érték true, ha nincs tárolt állapot
  });
  const location = useLocation(); // Az aktuális URL lekérése

  const handleMouseDown = (event) => {
    setIsDragging(true);
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    setStartPos({ x: clientX, y: clientY });
    const rect = menuRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({ left: rect.left, top: rect.top });
    }
  };

  const handleMouseMove = useCallback(
    (event) => {
      if (!isDragging) return;

      const clientX = event.clientX || event.touches[0].clientX;
      const clientY = event.clientY || event.touches[0].clientY;

      const deltaX = clientX - startPos.x;
      const deltaY = clientY - startPos.y;

      setPosition((prev) => ({
        left: prev.left + deltaX,
        top: prev.top + deltaY,
      }));

      setStartPos({ x: clientX, y: clientY });
    },
    [isDragging, startPos]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState); // Menü nyitás/zárás kezelése

    // LocalStorage-ban tároljuk a nyitott/zárt állapotot
    localStorage.setItem("floatingMenuState", JSON.stringify({ isOpen: newState }));
  };

  useEffect(() => {
    const handleTouchMove = (event) => handleMouseMove(event);
    const handleTouchEnd = () => handleMouseUp();

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, handleMouseMove]);

  return (
    <div
      ref={menuRef}
      className={`floating-menu ${isOpen ? "open" : "closed"}`}  // Dinamikus osztály hozzáadása
      style={{
        position: "absolute",
        left: `${position.left}px`,
        top: `${position.top}px`,
        cursor: isDragging ? "grabbing" : "grab",
        transition: isDragging ? "none" : "var(--transition-medium)",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      <img
        src="/icons/nav/close.png"
        alt="toggle menu"
        className="close"
        onClick={toggleMenu} // Menü nyitás/zárás kezelése
      />
      <span className="menu-separator"></span>
      <div className="menu-items">
        <Link to="/" className="menu-item">
          <img
            src={`/icons/nav/home${location.pathname === "/" ? "-filled" : ""}.png`}
            alt="home"
            className={location.pathname === "/" ? "active" : ""}
          />
        </Link>
        <Link to="/login" className="menu-item">
          <img
            src={`/icons/nav/login${location.pathname === "/login" ? "-filled" : ""}.png`}
            alt="login"
            className={location.pathname === "/login" ? "active" : ""}
          />
        </Link>
        <Link to="/carPicker" className="menu-item car">
          <img
            src={`/icons/nav/carPicker${location.pathname === "/carPicker" ? "-filled" : ""}.png`}
            alt="carPicker"
            className={location.pathname === "/carPicker" ? "active" : ""}
          />
        </Link>
        <Link to="/datePicker" className="menu-item">
          <img
            src={`/icons/nav/datePicker${location.pathname === "/datePicker" ? "-filled" : ""}.png`}
            alt="datePicker"
            className={location.pathname === "/datePicker" ? "active" : ""}
          />
        </Link>
        <Link to="/plotPicker" className="menu-item">
          <img
            src={`/icons/nav/plotPicker${location.pathname === "/plotPicker" ? "-filled" : ""}.png`}
            alt="plotPicker"
            className={location.pathname === "/plotPicker" ? "active" : ""}
          />
        </Link>
      </div>
    </div>
  );
};

export default FloatingMenu;
