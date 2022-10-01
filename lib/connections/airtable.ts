import Airtable from "airtable";
export const airtableBase = new Airtable({
  apiKey: process.env.API_KEY_AIRTABLE,
}).base(process.env.ID_BASE_APP_AIRTABLE);
