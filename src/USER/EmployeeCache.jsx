import axios from "axios";
import { API_URL } from "../config";

let cache = {
  token: null,
  employees: null,
  promise: null,
  timestamp: null,
};

export async function getEmployees(token) {
  const isExpired =
    !cache.timestamp ||
    Date.now() - cache.timestamp > 10 * 60 * 1000;

  const isDifferentUser = cache.token !== token;

  if (cache.employees && !isExpired && !isDifferentUser) {
    return cache.employees;
  }

  if (cache.promise && !isDifferentUser) {
    return cache.promise;
  }

  cache.promise = axios
    .get(API_URL + "/search/showAllEmployee", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      cache = {
        token,
        employees: res.data.data,
        promise: null,
        timestamp: Date.now(),
      };

      return cache.employees;
    })
    .catch((err) => {
      cache.promise = null;
      throw err;
    });

  return cache.promise;
}