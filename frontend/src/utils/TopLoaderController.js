class TopLoaderController {
  constructor() {
    this.subscribers = [];
    this.progress = 0;
    this.activeRequests = 0;
    this.timer = null;
    this.visible = false;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach((cb) => cb({ progress: this.progress, visible: this.visible }));
  }

  start() {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.visible = true;
      this.progress = 0;
      this.notify();
      
      this.timer = setInterval(() => {
        // Increment progress slightly, approaching 90% but never reaching 100% until done
        this.progress = this.progress + (90 - this.progress) * 0.1;
        this.notify();
      }, 200);
    }
  }

  done() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      clearInterval(this.timer);
      this.progress = 100;
      this.notify();

      // Hide after a short delay so the 100% animation completes
      setTimeout(() => {
        this.visible = false;
        this.progress = 0;
        this.notify();
      }, 300);
    }
  }
}

export const topLoader = new TopLoaderController();
