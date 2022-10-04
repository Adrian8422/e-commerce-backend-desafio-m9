import { productIndex } from "lib/connections/algolia";
import { getOffsetAndLimitFromReq } from "lib/functions/requests";

export async function getProductInALgolia(search, req) {
  const { offset, limit } = getOffsetAndLimitFromReq(req);

  const res = await productIndex.search(search, {
    offset: offset,
    length: limit,
  });
  if(!res){
    return {message:"no encontramos ese producto"}
  }
  const hits = await res.hits;

  return {
    results: hits,
    pagination: {
      offset,
      limit,
      total: hits.length,
    },
  };
}

export async function getProductIdAlgolia(productId) {
  const res = await productIndex.findObject((hit) => hit.objectID == productId);
  const data = await res.object;
  if (data) {
    return data;
  } else {
    return {
      message: "No encontramos un producto con ese id en la base de datos",
    };
  }
}
