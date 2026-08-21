import test from "node:test";
import assert from "node:assert/strict";
import { normalizePage } from "../../src/services/response.js";
import { toPageParams } from "../../src/services/api.js";

test("legacy pagination fields map to the documented query contract", () => {
  assert.deepEqual(toPageParams({ query: "Vue", pageNo: 2, pageSize: 5 }), {
    keyword: "Vue",
    page: 2,
    size: 5,
  });
});

test("a string can be used as a search keyword", () => {
  assert.deepEqual(toPageParams("Spring"), { keyword: "Spring", page: 1, size: 10 });
});

test("documented records pagination is normalized", () => {
  assert.deepEqual(
    normalizePage({ records: [{ id: 1 }], total: 11, current: 2, size: 10, pages: 2 }),
    { items: [{ id: 1 }], total: 11, page: 2, size: 10, pages: 2 },
  );
});

test("plain list responses remain supported", () => {
  assert.deepEqual(normalizePage([1, 2]), { items: [1, 2], total: 2, page: 1, size: 2, pages: 1 });
});
