const ROUTE_POST = require("express").Router();
const {
  POST_POSTER,
  PUT_POSTER_LIKES,
  PUT_POSTER_UNLIKES,
  PUT_POSTER_COMMENTAIRE,
  DELETE_POST_POSTER,
  DELETE_POSTER_COMMENTAIRE,
  GET_LISTE_POSTER,
} = require("../Controllers/PostController");
const { body } = require("express-validator");
const multer = require("multer");

// CONFIGURATION DE MULTER
/**Seulement en developpement */
// const storage = (chemin) => {
//   return multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, chemin);
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname.split(" ").join("_"));
//     },
//   });
// };
/**Seulement en production */
const storage = () => {
  return multer.diskStorage({});
};
// const CHEMIN_PHOTO = [process.env.CHEMIN_POST];
/**Seulement en developement */
// const CHEMIN_PHOTO = ["../client/public/assets/images/post"];
// const upload_post = multer({ storage: storage(CHEMIN_PHOTO[0]), limits: { fileSize: 3000000 } });
const upload_post = multer({ storage: storage(), limits: { fileSize: 3000000 } });

ROUTE_POST.get("/poster", GET_LISTE_POSTER);

ROUTE_POST.post("/poster", upload_post.single("post"), POST_POSTER);
ROUTE_POST.put("/poster/like/:id_post", PUT_POSTER_LIKES);
ROUTE_POST.put("/poster/unlike/:id_post", PUT_POSTER_UNLIKES);
ROUTE_POST.put("/poster/commentaire/:id_post", 
body("postCommentaire")
    .not()
    .isEmpty()
    .withMessage("Veuillez ecrire votre commentaire...")
   ,PUT_POSTER_COMMENTAIRE);

ROUTE_POST.delete("/poster/delete/:id_post", DELETE_POST_POSTER);
ROUTE_POST.put(
  "/poster/delete/commentaire/:id_post",
  DELETE_POSTER_COMMENTAIRE
);

module.exports = ROUTE_POST;