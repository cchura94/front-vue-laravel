import {Api} from "./Api.service"

export default {
    login: (credenciales) => {
        return Api().post('/v1/auth/login', credenciales);
    },

    registro: () => {
        
    },

    perfil: () => {
        
    },

    logout: () => {
        
    }
}