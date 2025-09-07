"use server";

import axios from "axios";

export async function getApiClient() {
  return axios.create({
    baseURL: process.env.API_URL, 
    withCredentials: true,        
  });
}
