import { Meta } from "./meta.service";

export default {
    enviarMensaje(msg){
        return Meta().post("/messages", msg)
    }
}