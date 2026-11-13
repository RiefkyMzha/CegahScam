import assert from "node:assert/strict";
import test from "node:test";
import { requestAiService } from "../src/aiClient";

test("formats FastAPI validation details as a string", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        detail: [
          { loc: ["body", "kronologi_user"], msg: "Field required" },
          { loc: ["body", "platform"], msg: "String should have at least 1 character" },
        ],
      }),
      { status: 422 },
    );

  try {
    const result = await requestAiService(
      "http://ai.local/test",
      {},
      "Permintaan ke AI Service gagal.",
    );

    assert.deepEqual(result, {
      ok: false,
      status: 422,
      message:
        "body.kronologi_user: Field required; body.platform: String should have at least 1 character",
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("uses a readable fallback for non-JSON upstream errors", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response("<html>Bad Gateway</html>", {
      status: 502,
      headers: { "Content-Type": "text/html" },
    });

  try {
    const result = await requestAiService(
      "http://ai.local/test",
      {},
      "Permintaan ke AI Service gagal.",
    );

    assert.deepEqual(result, {
      ok: false,
      status: 502,
      message: "Permintaan ke AI Service gagal.",
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
