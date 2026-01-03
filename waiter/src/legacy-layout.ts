let rafId: number | null = null;

function updateLegacyLayout() {
  if (!document.documentElement.classList.contains("legacy")) {
    return;
  }
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }
  rafId = requestAnimationFrame(() => {
    const grid = document.querySelector<HTMLElement>(".legacy-grid-container");
    const card = document.querySelector<HTMLElement>(".legacy-items-card");
    const scroll = document.querySelector<HTMLElement>(".legacy-items-scroll");
    if (!grid || !card) {
      return;
    }
    const gridRect = grid.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const available = Math.max(120, gridRect.bottom - cardRect.top - 160);
    card.style.height = `${available}px`;
    card.style.maxHeight = `${available}px`;

    if (scroll) {
      const header = card.firstElementChild as HTMLElement | null;
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const scrollMax = Math.max(100, available - headerHeight - 8);
      scroll.style.maxHeight = `${scrollMax}px`;
    }
  });
}

export function bindLegacyLayout() {
  if (!document.documentElement.classList.contains("legacy")) {
    return () => {};
  }
  updateLegacyLayout();
  window.addEventListener("resize", updateLegacyLayout);
  window.addEventListener("orientationchange", updateLegacyLayout);
  return () => {
    window.removeEventListener("resize", updateLegacyLayout);
    window.removeEventListener("orientationchange", updateLegacyLayout);
  };
}
