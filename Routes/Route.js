const ROUTE = require("express").Router();
const { body } = require("express-validator");
const {
  POST_INSCRIPTION,
  POST_CONNEXION,
  GET_LISTE_UTILISATEUR,
  GET_PROFIL,
  PUT_MODIFIER_PROFIL,
  PUT_PASSWORD,
  DELETE_UTILISATEUR,
  DELETE_DECONNEXION,
  PATCH_REFUSER_INVITATION,
  PATCH_ENVOYER_INVITATION,
  PATCH_ANNULER_INVITATION,
  PATCH_ACCEPTER_INVITATION,
  PATCH_SUPPRIMER_AMIS,
  PATCH_SUIVRE,
  PATCH_ANNULER_SUIVIE,
  PATCH_DESABONNER,
  PATCH_MODIFIER_PHOTO,
  PATCH_MODIFIER_COUVERTURE,
  PATCH_MODIFIER_PHOTO_PROFIL,
  PATCH_MODIFIER_PHOTO_COUVERTURE,
} = require("../Controllers/Controller");
const multer = require("multer");

// CONFIGURATION DE MULTER
/**Ici ce code est valable seulement en developpement */
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


// CONFIGURATION DE MULTER
/**Ici ce code est valable seulement en production */
const storage = () => {
  return multer.diskStorage({});
};

const CHEMIN_PHOTO = [
  "../client/public/assets/images/profil",
  "../client/public/assets/images/couverture",
  ,
];
/** Valable seulement en developpement */
// const upload_photo_profil = multer({ storage: storage(CHEMIN_PHOTO[0]) });
// const upload_photo_couverture = multer({ storage: storage(CHEMIN_PHOTO[1]) });

/** Valable seulement en production */
const upload_photo_profil = multer({ storage: storage() });
const upload_photo_couverture = multer({ storage: storage() });

// LES GET
ROUTE.get("/liste/utilisateur", GET_LISTE_UTILISATEUR);
ROUTE.get("/utilisateur/profil", GET_PROFIL);

//LES POST
ROUTE.post(
  "/inscription",
  body("pseudo")
    .not()
    .isEmpty()
    .withMessage("Le champs Pseudo est obligatoire")
    .isLength({ min: 3, max: 25 })
    .withMessage("Le champs Pseudo doit avoir 3 à 25 caractères"),
  body("naissance")
    .isDate()
    .withMessage("Le champs Date de naissance est obligatoire..."),
  body("sexe").not().isEmpty().withMessage("Le champs Sexe est obligatoire..."),
  body("email").isEmail().withMessage("Le champs Email est obligatoire..."),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Le champs Mot de passe est obligatoire...")
    .isLength({ min: 6, max: 20 })
    .withMessage("Le champs mot de passe doit avoir 6 à 20 caractères"),
  body("conf_password")
    .not()
    .isEmpty()
    .withMessage("Le champs confimation de mot de passe est obligatoire...")
    .isLength({ min: 6, max: 20 })
    .withMessage(
      "Le champs confimation de mot de passe doit avoir 6 à 20 caractères"
    ),
  POST_INSCRIPTION
);

ROUTE.post(
  "/connexion",
  body("email").isEmail().withMessage("Le champs Email est obligatoire..."),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Le champs Mot de passe est obligatoire...")
    .isLength({ min: 6, max: 20 })
    .withMessage("Le champs mot de passe doit avoir 6 à 20 caractères"),
  POST_CONNEXION
);

//LES PUT OU PACTH

ROUTE.patch("/envoyer/invitation/:ID_INVITATION", PATCH_ENVOYER_INVITATION);
ROUTE.patch("/annuler/invitation/:ID_INVITATION", PATCH_ANNULER_INVITATION);
ROUTE.patch("/accepter/invitation/:ID_INVITATION", PATCH_ACCEPTER_INVITATION);
ROUTE.patch("/refuse/invitation/:ID_INVITATION", PATCH_REFUSER_INVITATION);
ROUTE.patch("/supprimer/amis/:ID_INVITATION", PATCH_SUPPRIMER_AMIS);
ROUTE.patch("/suivre/:ID_INVITATION", PATCH_SUIVRE);
ROUTE.patch("/annuler/suivre/:ID_INVITATION", PATCH_ANNULER_SUIVIE);
ROUTE.patch("/retirer/abonner/:ID_INVITATION", PATCH_DESABONNER);

ROUTE.patch(
  "/modifier/photo/profil",
  upload_photo_profil.single("profil"),
  PATCH_MODIFIER_PHOTO_PROFIL
);
ROUTE.patch(
  "/modifier/photo/couverture",
  upload_photo_couverture.single("couverture"),
  PATCH_MODIFIER_PHOTO_COUVERTURE
);

ROUTE.put(
  "/modifier/profil/identifiant",
  body("pseudo")
    .not()
    .isEmpty()
    .withMessage("Le champs Pseudo est obligatoire")
    .isLength({ min: 3, max: 25 })
    .withMessage("Le champs Pseudo doit avoir 3 à 25 caractères"),
  body("naissance")
    .isDate()
    .withMessage("Le champs Date de naissance est obligatoire..."),
  body("sexe").not().isEmpty().withMessage("Le champs Sexe est obligatoire..."),
  body("email").isEmail().withMessage("Le champs Email est obligatoire..."),
  PUT_MODIFIER_PROFIL
);

ROUTE.put(
  "/modifier/profil/password",
  body("ancien_password")
    .not()
    .isEmpty()
    .withMessage("Le champs Nouveau Mot de passe est obligatoire...")
    .isLength({ min: 6, max: 20 })
    .withMessage("Le champs mot de passe doit avoir 6 à 20 caractères"),
  body("nouveau_password")
    .not()
    .isEmpty()
    .withMessage("Le champs Ancien Mot de passe est obligatoire...")
    .isLength({ min: 6, max: 20 })
    .withMessage("Le champs mot de passe doit avoir 6 à 20 caractères"),
  body("conf_password")
    .not()
    .isEmpty()
    .withMessage("Le champs Confimation de mot de passe est obligatoire...")
    .isLength({ min: 6, max: 20 })
    .withMessage(
      "Le champs confimation de mot de passe doit avoir 6 à 20 caractères"
    ),
  PUT_PASSWORD
);

//LES DELETE
ROUTE.delete("/supprimer/utilisateur/:ID_SUPPRIMER", DELETE_UTILISATEUR);
ROUTE.delete("/deconnexion", DELETE_DECONNEXION);

module.exports = ROUTE;
