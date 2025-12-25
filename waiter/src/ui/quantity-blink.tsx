import { useEffect, useRef, useState } from "react";

// QuantityBlink: blinks when quantity changes, using the given color
export function QuantityBlink({
  quantity,
  color,
  blinkOnMount = false,
  className,
}: {
  quantity: number;
  color: string;
  blinkOnMount?: boolean;
  className?: string;
}) {
  const [blink, setBlink] = useState(false);
  const prevQuantity = useRef(quantity);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      if (blinkOnMount) {
        setBlink(true);
        const timeout = setTimeout(() => setBlink(false), 500);
        return () => clearTimeout(timeout);
      }
      prevQuantity.current = quantity;
      return;
    }
    if (prevQuantity.current !== quantity) {
      setBlink(true);
      const timeout = setTimeout(() => setBlink(false), 500);
      prevQuantity.current = quantity;
      return () => clearTimeout(timeout);
    }
  }, [quantity, blinkOnMount]);

  return (
    <div
      className={`font-semibold mr-1 transition-colors duration-150 inline-flex items-center justify-center tabular-nums ${className ?? ""}`}
      style={{
        borderRadius: "4px",
        padding: "0 4px",
        minWidth: "3ch",
        background: blink ? color : undefined,
        color: blink ? "#fff" : undefined,
        textAlign: "right",
      }}
    >
      x{quantity}
    </div>
  );
}
