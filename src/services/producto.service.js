import { Api } from "./Api.service";

export default {
    index(page=1, limit=10, q=''){
        return Api().get(`/producto?page=${page}&limit=${limit}&q=${q}`);
    },
    store(datos){
        return Api().post(`/producto`, datos);
    },
    show(id){
        return Api().get(`/producto/${id}`);        
    },
    update(id, datos){
        return Api().put(`/producto/${id}`, datos);
    },
    destroy(id){
        return Api().delete(`/producto/${id}`);
    }
}