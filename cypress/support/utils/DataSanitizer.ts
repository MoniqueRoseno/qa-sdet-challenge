const SENSITIVE_KEYS = [
  "password",
  "token",
  "apiKey",
  "authorization",
  "secret",
];

export class DataSanitizer {
  static sanitize(data: unknown): unknown {
    if (Array.isArray(data)) {
      return data.map((item) => this.sanitize(item));
    }

    if (
      data !== null &&
      typeof data === "object"
    ) {
      return Object.fromEntries(
        Object.entries(
          data as Record<string, unknown>
        ).map(([key, value]) => {
          const isSensitive = SENSITIVE_KEYS.some(
            (sensitiveKey) =>
              key
                .toLowerCase()
                .includes(sensitiveKey.toLowerCase())
          );

          return [
            key,
            isSensitive
              ? "[REDACTED]"
              : this.sanitize(value),
          ];
        })
      );
    }

    return data;
  }
}