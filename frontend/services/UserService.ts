import { AuthenticationResponse, User } from "@/types/types";
const host =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://cne-groep9-function-app.azurewebsites.net";

const signUp = async (
  user: User
): Promise<AuthenticationResponse | undefined> => {
  try {
    const response = await fetch(`${host}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await response.json();
  } catch (error) {
    console.error("Error creating a user:", error);
  }
};

const logIn = async (
  user: User
): Promise<AuthenticationResponse | undefined> => {
  try {
    const response = await fetch(`${host}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await response.json();
  } catch (error) {
    console.error("Error creating a user:", error);
  }
};

export default {
  signUp,
  logIn,
};
