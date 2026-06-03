import axios from "axios";
import { API_URL } from "../config";

let cache = {
  token: null,
  employees: null,
  timestamp: null,
};

export async function getEmployees(token) {
  const isExpired = !cache.timestamp || Date.now() - cache.timestamp > 10 * 60 * 1000;
  const isDifferentUser = cache.token !== token;

  if (cache.employees && !isExpired && !isDifferentUser) {
    return cache.employees;
  }

  const res = await axios.get(API_URL + "/search/showAllEmployee", {
    headers: { Authorization: "Bearer " + token },
  });

  cache = {
    token,
    employees: res.data.data,
    timestamp: Date.now(),
  }; 

  return cache.employees;
}