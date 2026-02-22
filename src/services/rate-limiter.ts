export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillPeriod: number;
  private readonly unlimited: boolean;

  constructor(maxTokens: number, refillPeriod: number) {
    this.maxTokens = maxTokens;
    this.unlimited = !Number.isFinite(maxTokens);
    this.tokens = this.unlimited ? Number.POSITIVE_INFINITY : maxTokens;
    this.refillPeriod = refillPeriod;
    this.lastRefill = Date.now();
  }

  private refill(): void {
    if (this.unlimited) return;

    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = (elapsed / this.refillPeriod) * this.maxTokens;
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  canConsume(): boolean {
    if (this.unlimited) return true;
    this.refill();
    return this.tokens >= 1;
  }

  consume(): boolean {
    if (this.unlimited) return true;
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }

  get remaining(): number {
    if (this.unlimited) return Number.POSITIVE_INFINITY;
    this.refill();
    return Math.floor(this.tokens);
  }

  async waitForToken(): Promise<void> {
    while (!this.canConsume()) {
      await new Promise((r) => setTimeout(r, 1000));
    }
    this.consume();
  }
}
