// todo================ LIBRARIES ================
/**
 * *Renderizador de codigos QR
 * Se utilizara esta libreria para generar una imagen en consola de un codigo qur
 */
const qrcode = require("qrcode-terminal");
/**
 * *Lista de Stickers
 * Lista JSON que almacena los datos y direccion de las imagenes para hacer los stickers
 */
const stickersJSON = require("./stickers.json");
/**
 * *API para conectarse a Whatsapp
 *      Client: Gestiona una sesion de cliente de usuario de whatsapp
 *      MessageMedia: Maneja archivos multimedia
 */
const { Client, MessageMedia } = require("whatsapp-web.js");

// todo================ CLIENTE ================

//Se creo una instancia de Client con una estrategia de guardado de sesion Local
const client = new Client();
client.initialize();

console.log(
    "SE INICIO EL BOT-SESSION" + "\nEste modalidad NO permite guardar la sesion"
);
// todo================ STICKERS ================

class Sticker {
    constructor(name, autor, media) {
        this.name = name;
        this.autor = autor;
        this.media = media;
    }
}
let stickers = [];

/**
 * *Se recorre la lista de stickersJSON para crear una lista de objetos Sticker
 * El id de cada stickerJSON indicara la posicion del objeto en la lista de objetos Sticker
 * Si el id no es un Entero, no se creara el objeto
 */
stickersJSON.forEach((sticker) => {
    media = MessageMedia.fromFilePath(sticker["path"]);
    stickers.push(new Sticker(sticker["name"], sticker["autor"], media));
});

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
// * ---------------- Mensajes ----------------
mensaje1 = "Envia la palabra *sticker* para recibir el tuyo";
mensaje2 =
    "*Hola😊, \n🐻Quieres un sticker?*" +
    "\nEscribe un numero de la lista de animales🐵\n\n";
for (let i = 0; i < stickers.length; i++)
    mensaje2 += "\t*" + i + "*." + stickers[i].name + "\n";

// * ---------------- Recibir mensaje ----------------
client.on("message", (message) => {
    // * ---------------- sticker ----------------
    if (message.body.toLocaleLowerCase() == "sticker") {
        client.sendMessage(message.from, mensaje2);
    }

    // * ---------------- <numero> ----------------
    else if (
        parseInt(message.body) >= 0 &&
        parseInt(message.body) < stickers.length()
    ) {
        i = parseInt(message.body);
        client.sendMessage(message.from, stickers[i], {
            sendMediaAsSticker: true,
            stickerAuthor: stickers[i].autor,
            stickerName: stickers[i].name,
        });
    }

    // * ---------------- Default----------------
    else {
        client.sendMessage(message.from, mensaje1);
    }
});
