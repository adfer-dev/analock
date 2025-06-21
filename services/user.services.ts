import { AXIOS_INSTANCE } from "./interceptors";

export async function getUserByEmail(email: string): Promise<User | null> {
  const getUserUrl = `${process.env.API_ROOT_URL}api/v1/users/${email}`;
  let user: User | null = null;

  try {
    const response = await AXIOS_INSTANCE.get(getUserUrl);
    user = response.data as User;
  } catch (err) {
    console.error(err);
  }

  return user;
}
