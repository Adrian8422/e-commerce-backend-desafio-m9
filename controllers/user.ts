import { User } from "models/user";
export async function getDataUser(userId: string) {
  const user = new User(userId);
  await user.pull();
  return user.data;
}

///cambio de nombre a ese usuario
export async function patchUpdateDataUser(userId, data?) {
  console.log("data en controller", data);
  const { name, birthday, address } = data;
  const user = new User(userId);
  await user.pull();
  user.data.name = name;
  user.data.birthday = birthday;
  user.data.address = address;
  await user.push();
  return user.data;
}

export async function patchDataAddress(userId, newAddress) {
  const user = new User(userId);
  await user.pull();
  user.data.address = newAddress;
  await user.push();
  return user.data;
}
