const DEFAULT_ACCOUNT = "Sample account";

function walk(value: unknown, from: string, to: string): unknown {
  if (typeof value === "string") {
    return value.split(from).join(to);
  }
  if (Array.isArray(value)) {
    return value.map((item) => walk(item, from, to));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        walk(nested, from, to),
      ]),
    );
  }
  return value;
}

export function swapAccount<T>(value: T, account: string): T {
  const next = account.trim();
  if (!next || next === DEFAULT_ACCOUNT) {
    return value;
  }
  return walk(value, DEFAULT_ACCOUNT, next) as T;
}

export { DEFAULT_ACCOUNT };
