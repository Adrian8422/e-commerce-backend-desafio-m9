import { airtableBase } from "lib/connections/airtable";
import { productIndex } from "lib/connections/algolia";
import { getOffsetAndLimitFromReq } from "lib/functions/requests";

export async function getProductQueryInALgolia(search, req) {
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
export async function getArrayProductsIdAlgolia(productsIds){
  console.log(productsIds)
  const res = await productIndex.getObjects(productsIds)
  
  return res

}

export async function createProductsInAirtable (data){
  const {ownerId,title,price,categories,shipment,description,stock} = data
  const res =  await airtableBase("Table 1").create([
    {
      "fields": {
        "ownerId":ownerId,
        "title": title,
        "price": price,
        "categories": categories,
        "shipment": shipment,
        "description": description,
        "stock": stock
      }
    },
  ],
  ).catch((err)=>{console.log(err) })
  const dataobj = await res[0].fields
  return dataobj

}

export async  function getAllProductsOwner(offset,limit){
const res = await productIndex.search("",{
  offset:offset,
  length:limit
})

const hits = await res.hits
if(!hits){
  return {message:"no encontramos ningun producto"}
}
return {
  results: hits,
  pagination: {
    offset,
    limit,
    total: hits.length,
  }
} 
}
export async function updateByIdProduct(idProduct,ownerId,data){
  const {title,price,categories,shipment,description,stock} = data
  const res =await airtableBase('Table 1').update(idProduct, {
    "price": price,
    "categories": categories,
    "shipment": shipment,
    "ownerId": ownerId,
    "description": description,
    "stock": stock,
    "title": title
  },
  ).catch((err)=>{console.log(err) 
    return err})
  const dataobj = await res
  return dataobj.fields
}

export async function deleteByIdProduct(idProduct){

 const res= await airtableBase('Table 1').destroy( idProduct).catch((err)=>{console.error(err) 
}
)
if(res){
  return {message:"producto borrado con éxito"}
}else {
    return { message:"el producto que queres borrar no existe"}
  }
}

export async function stockManagement(idProduct,cantidad){
  const searchProduct =   await airtableBase('Table 1').find(idProduct)
  const product = await searchProduct
  const stockActual = product.fields.stock as number
  console.log("producto antes de  descontador stock",product.fields)

   let newStock = (stockActual - cantidad) <= 0? 0  : (stockActual - cantidad ) 

   console.log(product["stock"])
   const res =await airtableBase('Table 1').update(idProduct, {
 
     "stock": newStock,
    
   },
   ).catch((err)=>{console.log(err) 
     return err})
   const dataobj = await res
   console.log("ya realizado el cambio",dataobj)
   return dataobj.fields
}


 //ver si puedo traer el producto desde airtable asi  el manejo de stock lo realizo desde allí para que este actualizado, porque no deberia impactar directamente en algolia porque se va a romper la línea, primero ataco airtable y la syncronizacion permite que algolia recoja el stock actualizado de airtable :DDD
  






