// todo================     LIBRARIES ================
/**
 * *Renderizador de codigos QR
 * Se utilizara esta libreria para generar una imagen en consola de un codigo qur
 */
const qrcode = require("qrcode-terminal");

/**
 * *Acceder al sistema de ficheros
 * Permite interactuar con el sistema de archivos
 */
const fs = require("fs");
const path = require("path");

/**
 * *API para conectarse a Whatsapp
 *      Client: Gestiona una sesion de cliente de usuario de whatsapp
 *      LocalAuth: Estrategia que recuerda una sesion de una cuenta habilitada para múltiples dispositivos
 *                 Guarda los datos de la sesion en la carpeta '/.wwebjs_auth'
 *                 Si se quiere eliminar los datos de un sesion, eliminese la carpeta '/.wwebjs_auth'
 *      MessageMedia: Maneja archivos multimedia
 */
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");

// todo================ CLIENTE ================

//Se creo una instancia de Client con una estrategia de guardado de sesion Local
const client = new Client({
    //Estrategia para guardar la sesion
    authStrategy: new LocalAuth(),
});

client.initialize();
console.log(
    "SE INICIO EL BOT-SESSION" + "\nEste modalidad permite guardar la sesion"
);
// todo================ STICKERS ================

class Sticker {
    constructor(id, media, autor, nombre) {
        this.id = id;
        this.media = media;
        this.autor = autor;
        this.nombre = nombre;
    }
}

const autor = "Daniel";

const stickers = [
    new Sticker(
        "1",
        MessageMedia.fromFilePath("./images/1.jpg"),
        autor,
        "Buho de anteojos"
    ),
    new Sticker(
        "2",
        MessageMedia.fromFilePath("./images/2.jpg"),
        autor,
        "Oso Hormiguero"
    ),
    new Sticker(
        "3",
        MessageMedia.fromFilePath("./images/3.jpg"),
        autor,
        "Marmosa"
    ),
];

// todo================ VALIDACIONES ================

// * ---------------- Encender cliente ----------------

//Gerara un QR para enlazarce con el usuario si no hay una sesion guardada
client.on("qr", (qr) => {
    console.log("Escanee con el numero de telefono que tendra el bot:");
    //Utilizamos e metodo generate de la libreria qrcode para generar una imagen del qr
    qrcode.generate(qr, { small: true });
});

// * ---------------- Indica autenticacion ----------------
client.on("authenticated", () => {
    console.log("AUTHENTICATED");
});

// * ---------------- Despliega datos de fallo de autenticacion ----------------
client.on("auth_failure", (msg) => {
    // Fired if session restore was unsuccessful
    console.error("AUTHENTICATION FAILURE", msg);
});

// * ---------------- Indica cuando el cliente es listo ----------------
//Indica si el cliente pudo iniciar sesion
client.on("ready", () => {
    console.log("El cliente esta listo!");
});
// todo================ CODE ================

client.on("message", (message) => {
    if (message.body === "sticker") {
        mensaje =
            "Hola😊, \n🐻Quieres un sticker?" +
            "\nEscribe un numero de la lista de animales🐵\n\n";
        stickers.forEach((sticker) => {
            mensaje += "\t" + sticker.id + "." + sticker.nombre + "\n";
        });
        client.sendMessage(message.from, mensaje);
    } else if (parseInt(message.body) <= stickers.length) {
        i = parseInt(message.body) - 1;
        client.sendMessage(message.from, stickers[i].media, {
            sendMediaAsSticker: true,
            stickerAuthor: stickers[i].autor,
            stickerName: stickers[i].nombre,
        });
    } else {
        client.sendMessage(
            message.from,
            "Envia la palabra sticker para recibir el tuyo"
        );
    }
});
