export function id(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${(Math.random() * 1000000).toPrecision(6)}`
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
