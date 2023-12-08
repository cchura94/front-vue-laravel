import axios from 'axios'

const urlBaseMeta = "http://127.0.0.1:8000/api";
// const urlBaseMeta = "https://laravelvue.blumbit.net/back/public/api"

export function Api() {
    let token = localStorage.getItem("access_token");

    const api = axios.create({
        baseURL: urlBaseMeta,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+token
        }
    });

    // interceptor (errors 401, 403)
    api.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            if(error.response.status === 401){
                console.log("INTERCEPTOR: *******: ")
                localStorage.removeItem("access_token")
                window.location.href = "/login"
            }

            return Promise.reject(error);
        }
    )

    return api;

}
