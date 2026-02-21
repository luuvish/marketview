export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillPeriod: number;

  constructor(maxTokens: number, refillPeriod: number) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillPeriod = refillPeriod;
    this.lastRefill = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = (elapsed / this.refillPeriod) * this.maxTokens;
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  canConsume(): boolean {
    this.refill();
    return this.tokens >= 1;
  }

  consume(): boolean {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }

  get remaining(): number {
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
