import axios from "axios";

const BASE_URL =
  "https://ec2-13-233-179-121.ap-south-1.compute.amazonaws.com/api";

export const api = axios.create({
  baseURL: BASE_URL
});
