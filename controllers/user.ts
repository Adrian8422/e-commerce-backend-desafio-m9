import { User } from "models/user";
export async function getDataUser(userId: string) {
  const user = new User(userId);
  await user.pull();
  return user.data;
}

///cambio de nombre a ese usuario
export async function patchUpdateDataUser(userId, data?) {
  /// VER ACA EN EN EL ENDPOINT DONDE USAMOS ESTA FUNCION, COMO HACEMOS PARA QUE CUANDO EL USUARIO NO QUIERA CAMBAR ALGUNA DE LAS PROPIEDADES COMO NAME ADDRESS O BIRTHDAT QUE SE AUTOCOMPLETE CON LO ANTERIOR QUE TENIA PUESTO--- VER COMO LO HACEMOS
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
