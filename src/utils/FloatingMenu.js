import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

const FloatingMenu = () => {
  const menuRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(() => {
    const savedPosition = localStorage.getItem("floatingMenuPosition");
    return savedPosition ? JSON.parse(savedPosition) : { left: 30, top: 350 };
  });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem("floatingMenuState");
    return savedState ? JSON.parse(savedState).isOpen : true;
  });
  const location = useLocation();

  const SNAP_DISTANCE = 200; // Snap határ
  const EDGE_MARGIN = 16; // Minimális távolság az oldal szélétől (1rem = 16px)

  const handleMouseDown = (event) => {
    setIsDragging(true);
  
    // Ellenőrizzük, hogy érintéses eseményről van szó
    const clientX = event.clientX || (event.touches && event.touches[0]?.clientX);
    const clientY = event.clientY || (event.touches && event.touches[0]?.clientY);
  
    if (clientX != null && clientY != null) {
      setStartPos({ x: clientX, y: clientY });
      const rect = menuRef.current?.getBoundingClientRect();
      if (rect) {
        setPosition({ left: rect.left, top: rect.top });
      }
    }
  };
  

  const handleMouseMove = useCallback(
    (event) => {
      if (!isDragging) return;

    // Ellenőrizzük, hogy érintéses eseményről van szó
    const clientX = event.clientX || (event.touches && event.touches[0]?.clientX);
    const clientY = event.clientY || (event.touches && event.touches[0]?.clientY);

    if (clientX != null && clientY != null) {
      const deltaX = clientX - startPos.x;
      const deltaY = clientY - startPos.y;

      setPosition((prev) => ({
        left: prev.left + deltaX,
        top: prev.top + deltaY,
      }));

      setStartPos({ x: clientX, y: clientY });
    }
    },
    [isDragging, startPos]
  );

  const handleMouseUp = () => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Snap X tengelyen
      let newLeft = rect.left;
      if (rect.left <= SNAP_DISTANCE) {
        newLeft = EDGE_MARGIN;
      } else if (rect.right >= viewportWidth - SNAP_DISTANCE) {
        newLeft = viewportWidth - rect.width - EDGE_MARGIN;
      }

      // Snap Y tengelyen
      let newTop = rect.top;
      if (rect.top <= SNAP_DISTANCE) {
        newTop = EDGE_MARGIN;
      } else if (rect.bottom >= viewportHeight - SNAP_DISTANCE) {
        newTop = viewportHeight - rect.height - EDGE_MARGIN;
      }

    // Frissítsük az új pozíciót a snap után
    const finalPosition = { left: newLeft, top: newTop };
    setPosition(finalPosition);

    // Mentés a localStorage-be
    localStorage.setItem("floatingMenuPosition", JSON.stringify(finalPosition));
    }

    setIsDragging(false);
  };

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
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
