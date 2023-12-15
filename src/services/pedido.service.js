import { Api } from "./Api.service";

export default {
    index(page=1, limit=10, q=''){
        return Api().get(`/pedido?page=${page}&limit=${limit}&q=${q}`);
    },
    store(datos){
        return Api().post(`/pedido`, datos);
    },
    show(id){
        return Api().get(`/pedido/${id}`);        
    },
    update(id, datos){
        return Api().put(`/pedido/${id}`, datos);
    }
}