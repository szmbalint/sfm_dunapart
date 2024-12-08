import React, { useState, useRef, useEffect, useCallback } from "react";

const FloatingMenu = () => {
  const menuRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ left: 30, top: 350 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(true);  // Állapot, hogy a menü nyitva van-e

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
    setIsOpen((prevState) => !prevState); // Menü nyitása/zárása
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
        <img src="/icons/nav/home-filled.png" alt="home" className="active" />
        <img src="/icons/nav/user.png" alt="user" />
        <img src="/icons/nav/car.png" alt="car" className="car" />
        <img src="/icons/nav/calendar.png" alt="calendar" />
        <img src="/icons/nav/plot.png" alt="plot" />
      </div>
    </div>
  );
};

export default FloatingMenu;
