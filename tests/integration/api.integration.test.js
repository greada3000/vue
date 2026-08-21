import test from "node:test";
import assert from "node:assert/strict";

const baseUrl = process.env.API_BASE_URL || "http://localhost:8080";

const request = async (path, options) => {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();
  assert.equal(response.ok, true, body.message);
  assert.equal(body.success, true, body.message);
  return body;
};

test("OpenAPI and documented paginated resources are available", async () => {
  const docsResponse = await fetch(`${baseUrl}/api-docs`);
  assert.equal(docsResponse.ok, true);
  const docs = await docsResponse.json();
  assert.equal(docs.openapi, "3.1.0");

  for (const resource of ["users", "circles", "articles"]) {
    const body = await request(`/api/${resource}?keyword=&page=1&size=2`);
    assert.ok(Array.isArray(body.data.records));
    assert.equal(body.data.current, 1);
    assert.equal(body.data.size, 2);
    assert.equal(typeof body.data.total, "number");
  }
});

test("documented test administrator can log in", async () => {
  const body = await request("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: 10001, password: "123456" }),
  });
  assert.equal(body.data.userId, 10001);
  assert.equal(body.data.usertype, true);
});
