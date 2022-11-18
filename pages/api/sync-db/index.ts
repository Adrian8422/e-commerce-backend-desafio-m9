import { productIndex } from "lib/connections/algolia";
import { airtableBase } from "lib/connections/airtable";
import { NextApiRequest, NextApiResponse } from "next";

export default function (req: NextApiRequest, res: NextApiResponse) {
  try {
    airtableBase("Table 1")
      .select({
        // Selecting the first 3 records in Grid view:
        pageSize: 10,
      })
      .eachPage(
        async function (records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.
          // chequear ahora sin el nombre de la funcion
          const obj = records.map(function (record) {
            return {
              objectID: record.id,
              ownerId: record["ownerId"],
              ...record.fields,
            };
          });

          await productIndex.saveObjects(obj);

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
          res.status(200).send("todo ok");
        }
      );
  } catch (error) {
    res.status(404).send({ message: error });
  }
}
