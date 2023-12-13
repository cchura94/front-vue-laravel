import { Api } from "./Api.service";

export default {
    index(page=1, limit=10, q=''){
        return Api().get(`/cliente?page=${page}&limit=${limit}&q=${q}`);
    },
    store(datos){
        return Api().post(`/cliente`, datos);
    },
    show(id){
        return Api().get(`/cliente/${id}`);        
    },
    update(id, datos){
        return Api().put(`/cliente/${id}`, datos);
    },
    destroy(id){
        return Api().delete(`/cliente/${id}`);
    },
    buscarCliente(q=""){
        return Api().get(`/cliente/buscar-cliente?q=${q}`)
    }
}