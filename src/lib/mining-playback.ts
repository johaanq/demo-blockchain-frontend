import type { MiningLine } from "@/components/MiningTerminal";

const LINE_DELAY_MS = 280;
const LINE_DELAY_FLUSH_MS = 50;
const MAX_QUEUE = 48;

/** Cola de líneas para mostrar la minería más despacio (el cálculo en servidor sigue a velocidad real). */
export class MiningPlayback {
  private queue: MiningLine[] = [];
  private lines: MiningLine[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;
  private delayMs = LINE_DELAY_MS;

  constructor(
    private readonly onFlush: (update: { attempts: number; lines: MiningLine[] }) => void,
  ) {}

  enqueue(line: MiningLine) {
    this.queue.push(line);
    if (this.queue.length > MAX_QUEUE) {
      this.queue.splice(0, this.queue.length - MAX_QUEUE);
    }
    this.ensurePump();
  }

  private ensurePump() {
    if (this.timer) return;
    this.timer = setInterval(() => this.pumpOne(), this.delayMs);
  }

  private pumpOne() {
    const next = this.queue.shift();
    if (!next) {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      return;
    }
    this.lines = [...this.lines, next].slice(-30);
    this.onFlush({ attempts: next.attempt, lines: this.lines });
  }

  /** Vacía la cola al terminar el servidor (un poco más rápido que en vivo). */
  async drain(): Promise<void> {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    while (this.queue.length > 0) {
      this.pumpOne();
      await new Promise((r) => setTimeout(r, LINE_DELAY_FLUSH_MS));
    }
    await new Promise((r) => setTimeout(r, 120));
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.queue = [];
  }

  getLines() {
    return this.lines;
  }
}
