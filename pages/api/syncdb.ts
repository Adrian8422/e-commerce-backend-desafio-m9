import { productIndex } from "lib/connections/algolia";
import { airtableBase } from "lib/connections/airtable";
import { NextApiRequest, NextApiResponse } from "next";

export default function (req: NextApiRequest, res: NextApiResponse) {
  airtableBase("Table 1")
    .select({
      // Selecting the first 3 records in Grid view:
      pageSize: 10,
    })
    .eachPage(
      function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        const obj = records.map(function (record) {
          return {
            objectID: record.id,
            ...record.fields,
          };
        });
        if (obj) {
          productIndex.saveObjects(obj);
        }

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
  res.send("terminó");
}
