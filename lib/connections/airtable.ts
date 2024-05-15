import Airtable from "airtable";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.API_KEY_AIRTABLE,
});
export const airtableBase = Airtable.base(process.env.ID_BASE_APP_AIRTABLE);

console.log("aitabel baseSS", airtableBase);
