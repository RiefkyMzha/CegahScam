import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import test from "node:test";
import app from "../src/app";

test("returns JSON errors for invalid, unsupported, and oversized uploads", async (t) => {
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  t.after(
    () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  );

  const address = server.address() as AddressInfo;
  const url = `http://127.0.0.1:${address.port}/api/analysis/chat`;

  const unsupportedForm = new FormData();
  unsupportedForm.append(
    "fileBukti",
    new Blob(["not an image"], { type: "text/plain" }),
    "evidence.txt",
  );
  const unsupportedResponse = await fetch(url, {
    method: "POST",
    body: unsupportedForm,
  });
  assert.equal(unsupportedResponse.status, 400);
  assert.deepEqual(await unsupportedResponse.json(), {
    message:
      "Format file tidak didukung. Hanya JPG, PNG, dan WEBP yang diperbolehkan.",
  });

  const jpgMimeForm = new FormData();
  jpgMimeForm.append(
    "fileBukti",
    new Blob(["jpg"], { type: "image/jpg" }),
    "evidence.jpg",
  );
  jpgMimeForm.append("pesan", "");
  const jpgMimeResponse = await fetch(url, {
    method: "POST",
    body: jpgMimeForm,
  });
  assert.equal(jpgMimeResponse.status, 400);
  assert.deepEqual(await jpgMimeResponse.json(), {
    message: "Pesan harus diisi.",
  });

  const oversizedForm = new FormData();
  oversizedForm.append(
    "fileBukti",
    new Blob([new Uint8Array(15 * 1024 * 1024 + 1)], {
      type: "image/png",
    }),
    "oversized.png",
  );
  const oversizedResponse = await fetch(url, {
    method: "POST",
    body: oversizedForm,
  });
  assert.equal(oversizedResponse.status, 413);
  assert.deepEqual(await oversizedResponse.json(), {
    message: "Ukuran file maksimal 15 MB.",
  });
});
