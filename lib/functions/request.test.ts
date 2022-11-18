import test from "ava";
test("request limit/offset", (t) => {
  const maxLimit = 100;
  const maxOffset = 10000;
  let limit = 10;
  const req = { query: { limit: 12, offset: 0 } };
  const queryLimit = req.query.limit;
  const queryOffset = req.query.offset;
  const entrada = queryLimit && queryOffset;
  if (queryLimit > 0 && queryLimit < maxLimit) {
    limit = queryLimit;
  } else if (queryLimit > maxLimit) {
    limit = maxLimit;
  }
  const offset = queryOffset < maxOffset ? queryOffset : 0;
  const salida = limit && offset;
  t.deepEqual(entrada, salida);
});
