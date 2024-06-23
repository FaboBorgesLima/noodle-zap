import axios, { AxiosInstance } from "axios";

const prod = import.meta.env.PROD;
const mode = import.meta.env.MODE;

export const instance = createInstance(prod && mode != "development");
function createInstance(prod: boolean): AxiosInstance {
    let baseURL = "http://127.0.0.1:8080";

    if (prod) baseURL = "http://127.0.0.1:8080";

    return axios.create({
        baseURL,
    });
}
