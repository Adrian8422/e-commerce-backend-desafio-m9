import { Owner } from "models/owner";

export async function getDataOwner(ownerId: string) {
  const newOwner = new Owner(ownerId);
  await newOwner.pull();
  return newOwner.data;
}
