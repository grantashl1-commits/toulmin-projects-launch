import { useEffect, useRef, useState, useCallback } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  isLight?: boolean;
}

export function MagneticButton({
  children,
  href,
  className = "",
  isLight = false,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice) return;
      const btn = btnRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px) scale(1.03)`;
    },
    [isTouchDevice],
  );

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    if (btnRef.current) {
      btnRef.current.style.transform = "translate(0, 0) scale(1)";
    }
  }, [isTouchDevice]);

  return (
    <a
      ref={btnRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex items-center gap-1.5 transition-transform duration-300 ease-out ${isLight ? "btn-outline-light" : "btn-outline"} ${className}`}
    >
      {children}
    </a>
  );
}
