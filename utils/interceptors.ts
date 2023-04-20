import axios from "axios";

export function tokenInterceptor(token: string) {
  if (token) {
    axios.defaults.headers.common["X-Auth-token"] = token;
  }
}
