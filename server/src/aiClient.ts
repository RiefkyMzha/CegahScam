type AiServiceResult =
  | { ok: true; status: number; data: unknown }
  | { ok: false; status: number; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getValidationMessages(detail: unknown): string | undefined {
  if (!Array.isArray(detail)) return undefined;

  const messages = detail.flatMap((item): string[] => {
    if (typeof item === "string") return [item];
    if (!isRecord(item) || typeof item.msg !== "string") return [];

    const location = Array.isArray(item.loc)
      ? item.loc.map(String).join(".")
      : "";

    return [location ? `${location}: ${item.msg}` : item.msg];
  });

  return messages.length > 0 ? messages.join("; ") : undefined;
}

function getErrorMessage(payload: unknown): string | undefined {
  if (!isRecord(payload)) return undefined;

  if (typeof payload.detail === "string" && payload.detail.trim()) {
    return payload.detail;
  }

  const validationMessages = getValidationMessages(payload.detail);
  if (validationMessages) return validationMessages;

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  return undefined;
}

export async function requestAiService(
  url: string,
  init: RequestInit,
  fallbackMessage: string,
): Promise<AiServiceResult> {
  const response = await fetch(url, init);
  let payload: unknown;

  try {
    const body = await response.text();
    payload = body ? JSON.parse(body) : undefined;
  } catch {
    return {
      ok: false,
      status: response.ok ? 502 : response.status,
      message: response.ok
        ? "AI Service mengembalikan respons dengan format tidak valid."
        : fallbackMessage,
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: getErrorMessage(payload) ?? fallbackMessage,
    };
  }

  return { ok: true, status: response.status, data: payload };
}
