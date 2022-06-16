const stickers = require("./stickers.json");
// console.log(stickers[2]);
// console.log(stickers);

// stickers.forEach((sticker) => {
//     sticker["media"] = sticker["path"] + "media";
// });
// console.log(stickers);
// console.log(stickers.length);
// console.log(stickers[1]["name"]);

// f = "12";
// // console.log(f);
// fnum = parseInt(f);
// if (!isNaN(fnum)) {
//     fnum = 0;
//     console.log("sdf");
// }
// console.log(fnum);

list = [];
// console.log(list);
list[-1] = 1;
list[1] = 1;
list[3] = 2;

list.forEach((element) => {
    console.log(element);
});
console.log(list);
if (list[0] == null) {
    console.log("testeto");
}
