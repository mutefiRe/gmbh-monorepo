function shouldHandle(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select" || tag === "label") {
    return false;
  }
  if (target.isContentEditable) return false;
  return true;
}

function installFastClick() {
  if (!("ontouchstart" in window)) return;
  const root = document.documentElement;
  if (!root.classList.contains("legacy")) return;

  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let target: EventTarget | null = null;

  document.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
      target = event.target;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    (event) => {
      if (!target || !shouldHandle(target)) {
        target = null;
        return;
      }
      const touch = event.changedTouches[0];
      const dx = Math.abs(touch.clientX - startX);
      const dy = Math.abs(touch.clientY - startY);
      const dt = Date.now() - startTime;
      const isTap = dx < 10 && dy < 10 && dt < 500;
      if (isTap) {
        event.preventDefault();
        const click = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window
        });
        (target as HTMLElement).dispatchEvent(click);
      }
      target = null;
    },
    { passive: false }
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", installFastClick, { once: true });
} else {
  installFastClick();
}
