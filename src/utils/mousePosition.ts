let position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let subscribers = 0;
let handler: ((e: MouseEvent) => void) | null = null;

export function subscribeMousePosition(): () => void {
  subscribers += 1;
  if (!handler) {
    handler = (e: MouseEvent) => {
      position = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handler, { passive: true });
  }

  return () => {
    subscribers -= 1;
    if (subscribers <= 0 && handler) {
      window.removeEventListener("mousemove", handler);
      handler = null;
      subscribers = 0;
    }
  };
}

export function getMousePosition() {
  return position;
}
