import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

/**
 * Reusable, premium sliding Drawer component.
 * Slides in/out from the right and supports title, custom size, scrollable body, and optional footer.
 * Features buttery smooth entry and exit transitions.
 */
const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md", // "sm" | "md" | "lg"
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  // Sync animation states on open / close
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small timeout guarantees browser layout pass occurs before applying transition classes
      const timer = setTimeout(() => {
        setAnimate(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Matches transition-duration (300ms)
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  // Size styling map
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop with Fade In/Out Transition */}
      <div
        className={`absolute inset-0 bg-[#0A0A0B]/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          animate ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        {/* Panel with Slide In/Out Transition */}
        <div
          className={`w-screen ${
            sizeClasses[size]
          } bg-white shadow-2xl border-l border-gray-100 flex flex-col h-full transform transition-all duration-300 ease-in-out ${
            animate ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            {typeof title === "string" ? (
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                {title}
              </h2>
            ) : (
              title
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-95 outline-none"
              aria-label="Close panel"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
            {children}
          </div>

          {/* Footer (Optional) */}
          {footer && (
            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50 sticky bottom-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
