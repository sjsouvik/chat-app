import { serverRequests } from "./serverRequests";

export const loginWithCreds = async (email, password) => {
  const { response, statusCode } = await serverRequests({
    requestType: "post",
    url: `${import.meta.env.VITE_APP_BACKEND}/login`,
    data: { email: email, password: password },
  });

  if (statusCode === 401 || statusCode === 400 || statusCode === 422) {
    return { error: true, message: "Invalid email and password combination" };
  }

  if (statusCode !== 200) {
    return { error: true, message: "Something went wrong" };
  }

  return response && response.data ? { data: response.data } : { data: null };
};
