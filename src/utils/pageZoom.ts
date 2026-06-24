const STORE_KEY = "zoomPercent";

const DEFAULT_ZOOM = 100;

const ZoomPercents = [
  70, 80, 85, 90, 95, 100, 105, 110, 115, 120, 130, 150, 170, 200, 240, 270,
  300,
];

class PageZoom {
  private zoomPercent = DEFAULT_ZOOM;

  public constructor() {
    const percent = Number(localStorage.getItem(STORE_KEY)) || DEFAULT_ZOOM;
    this.setZoomPercent(percent);
  }

  public zoomIn(): void {
    const index = ZoomPercents.indexOf(this.zoomPercent);
    if (index < ZoomPercents.length - 1) {
      this.setZoomPercent(ZoomPercents[index + 1]);
    }
  }

  public zoomOut(): void {
    const index = ZoomPercents.indexOf(this.zoomPercent);
    if (index > 0) {
      this.setZoomPercent(ZoomPercents[index - 1]);
    }
  }

  public getZoomPercent(): number {
    return this.zoomPercent;
  }

  public setZoomPercent(percent: number): void {
    const index = ZoomPercents.indexOf(percent);
    if (index < 0) {
      this.reset();
      return;
    }

    this.zoomPercent = percent;
    localStorage.setItem(STORE_KEY, String(percent));

    const factor = `${String(percent)}%`;

    // Warning: Do not use `style.zoom` because that will cause the page width
    // to scale beyond the visible width and make the page very hard to use.
    document.body.style.fontSize = factor;
  }

  public reset(): void {
    this.setZoomPercent(DEFAULT_ZOOM);
  }
}

export const pageZoom = new PageZoom();
