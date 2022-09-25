import { User } from "models/user";
export async function getDataUser(userId: string) {
  const user = new User(userId);
  await user.pull();
  return user.data;
}
