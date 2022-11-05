import { productIndex } from "lib/connections/algolia";
import { airtableBase } from "lib/connections/airtable";
import { NextApiRequest, NextApiResponse } from "next";




export default function (req: NextApiRequest, res: NextApiResponse) {
  try {
     airtableBase("Table 1")
        .select({})
        .eachPage(
           async function (records, fetchNextPage) {
              const results = records.map((record) => {
                 return {
                    objectID: record.id,
                    ...record.fields,
                 };
              });

              await productIndex.saveObjects(results);
              fetchNextPage();
           },

           function done(err) {
              if (err) {
                 console.error(err);
                 return;
              }
              res.status(200).send("Done");
           }
        );
  } catch (err) {
     res.status(500).send({ message: err });
  }
}
