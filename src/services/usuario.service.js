import { Api } from "./Api.service";

export default {
    listarUsuarios(){
        return Api().get("/usuario");
    },

    guardarUsuario(datos){
        return Api().post("/usuario", datos);
    },

    mostrarUsuario(id){
        return Api().get("/usuario/"+id);
    },

    modificarUsuario(id, datos){
        return Api().put("/usuario/"+id);
    },

    eliminarUsuario(id){
        return Api().delete("/usuario/"+id);
    }
}