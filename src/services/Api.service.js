import axios from 'axios'

const urlBaseMeta = "http://127.0.0.1:8000/api";

export function Api() {
    let token = "";

    const api = axios.create({
        baseURL: urlBaseMeta,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+token
        }
    });

    return api;

}
