import { useEffect, useRef, useState } from "react";

// QuantityBlink: blinks when quantity changes, using the given color
export function QuantityBlink({ quantity, color, blinkOnMount = false }: { quantity: number; color: string; blinkOnMount?: boolean }) {
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
      className={`font-semibold mr-1 transition-colors duration-150`}
      style={{
        borderRadius: "4px",
        padding: "0 4px",
        background: blink ? color : undefined,
        color: blink ? "#fff" : undefined,
      }}
    >
      x{quantity}
    </div>
  );
}
