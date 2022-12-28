import { User } from "models/user";

type GetDataUser = {
  user: {
    address?: string;
    birthday?: string;
    createdAt: Date;
    email: string;
    name?: string;
  };
};

export async function getDataUser(userId: string): Promise<GetDataUser> {
  const user = new User(userId);
  await user.pull();
  return user.data;
}

type UpdateDataUser = {
  user: {
    address?: string;
    birthday?: string;
    createdAt: Date;
    email: string;
    name?: string;
  };
};
///
export async function patchUpdateDataUser(
  userId: string,
  data?
): Promise<UpdateDataUser> {
  console.log("data en controller", data);
  const { name, cellphone, address } = data;
  const user = new User(userId);
  await user.pull();
  user.data.name = name;
  user.data.cellphone = cellphone;
  user.data.address = address;
  await user.push();
  return user.data;
}

type patchDataAddress = {
  user: {
    address: string;
  };
};

export async function patchDataAddress(
  userId: string,
  newAddress: string
): Promise<patchDataAddress> {
  const user = new User(userId);
  await user.pull();
  user.data.address = newAddress;
  await user.push();
  return user.data;
}
