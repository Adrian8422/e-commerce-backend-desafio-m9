import { productIndex } from "lib/connections/algolia";
import { airtableBase } from "lib/connections/airtable";
import { NextApiRequest, NextApiResponse } from "next";




export default  function (req: NextApiRequest, res: NextApiResponse) {

   airtableBase("Table 1")
    .select({
      // Selecting the first 3 records in Grid view:
      pageSize: 10,
    })
    .eachPage(
      async function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

         await records.map(async function (record) {
          // console.log("unoporuno",record)
          const objetoRecord= {
            objectID: record.id,
            ownerId:record["ownerId"],
            ...record.fields,
          };
         const addProductInAlgolia = await productIndex.saveObject(objetoRecord)
         console.log("veamos que pasa",addProductInAlgolia)
        });
        // if (obj) {

      //  const productos = await productIndex.saveObjects(obj)
      //  const aversillegaron = await productIndex.getObjects(productos.objectIDs)
      //  console.log("a ver que datos hay en los productos para algolia",aversillegaron)
        // }

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  res.send("terminó now");
}
