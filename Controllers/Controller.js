const UTILISATEURS = require("../Models/Utilisateurs");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { createToken } = require("./Token");
const cloudinary = require('../helper/upload');

const LISTE_UTILISATEUR = async (res)=>{
  const LISTE_UTILISATEUR = await UTILISATEURS.find().sort({pseudo : 1});

  if (!LISTE_UTILISATEUR)
    return res
      .status(400)
      .json({ erreur_liste_utilisateur: "Aucun utilisateur trouvé..." });

  LISTE_UTILISATEUR.forEach((UTIL) => {
    UTIL.password = ""; //Vider le contenu de password
    UTIL.verification = ""; //Vider le contenu de la verification
    UTIL.PasseGenere = ""; //Vider le contenu de passeGene
  });
  return res.status(200).json({
    LISTE_UTILISATEUR,
  });
}

// GET
module.exports.GET_PROFIL = async (req, res) => {
  const ID_CONNTECTER = req.user?.payload;
  try {
    if (!ID_CONNTECTER)
      return res
        .status(400)
        .json({ erreur_utilisateur_connect: `Veuillez vous connecter... !` });
    const UTILISATEU_CONNTECT = await UTILISATEURS.findById(ID_CONNTECTER);
    UTILISATEU_CONNTECT.password = "";
    res.status(200).json({ UTILISATEU_CONNTECT });
  } catch (error) {
    return res
      .status(500)
      .json({ erreur_server: `Le server à rencontré un problème` });
  }
};

module.exports.GET_LISTE_UTILISATEUR = async (req, res) => {
  try {
    LISTE_UTILISATEUR(res)
  } catch (error) {
    return res
      .status(500)
      .json({ erreur_server: `Le server à rencontré un problème` });
  }
};


// PATCH

module.exports.PATCH_MODIFIER_PHOTO_PROFIL = async (req, res)=>{
  const ID_CONNTECTER = req.user?.payload
  let photo_profil = req.file?.filename
  if(!photo_profil) return res.status(400).json({erreur_photo: 'Veuillez selectionner une photo'})
  
  try {
  console.log('premier' + req.file.path)
  photo_profil = await cloudinary.uploader.upload(req.file.path, {folder: 'socialPharma36'});
  console.log('deuxieme' + photo_profil)
  photo_profil = photo_profil.secure_url;
  console.log('troisieme' + photo_profil)
  const UTILISATEUR  = await UTILISATEURS.findByIdAndUpdate(ID_CONNTECTER, {photo_profil})
  UTILISATEUR.password = ""; //Vider le contenu de password
  UTILISATEUR.verification = ""; //Vider le contenu de la verification
  UTILISATEUR.PasseGenere = ""; //Vider le contenu de passeGene
 return res.status(200).json({UTILISATEUR})
} catch (error) {
  console.log(error)
  return res
  .status(500)
  .json({ erreur_server: `Le server à rencontré un problème` });
}
}
module.exports.PATCH_MODIFIER_PHOTO_COUVERTURE = async (req, res)=>{
  const ID_CONNTECTER = req.user?.payload
  // const photo_couverture = req.file?.filename
  let photo_couverture = req.file?.filename
  if(!photo_couverture) return res.status(400).json({erreur_photo: 'Veuillez selectionner une photo'})
try {
  photo_couverture = await cloudinary.uploader.upload(req.file.path, {folder: 'socialPharma36'});
  photo_couverture = photo_couverture.secure_url;
 const UTILISATEUR = await UTILISATEURS.findByIdAndUpdate(ID_CONNTECTER, {photo_couverture})
  UTILISATEUR.password = ""; //Vider le contenu de password
  UTILISATEUR.verification = ""; //Vider le contenu de la verification
  UTILISATEUR.PasseGenere = ""; //Vider le contenu de passeGene
 return res.status(200).json({UTILISATEUR})

} catch (error) {
  
  return res
  .status(500)
  .json({ erreur_server: `Le server à rencontré un problème` });
}
}

module.exports.PATCH_DESABONNER = async (req, res) => {
  const ID_CONNTECTER = req.user?.payload;
  const {ID_INVITATION} = req.params;

try {
  await UTILISATEURS.findByIdAndUpdate(ID_CONNTECTER, { $pull: {abonnes: ID_INVITATION} });
  await UTILISATEURS.findByIdAndUpdate(ID_INVITATION, { $pull: {suivies: ID_CONNTECTER} });

  LISTE_UTILISATEUR(res)
} catch (error) {
  console.log(error)
  return res
    .status(500)
    .json({ erreur_server: `Le server à rencontré un problème` });
}
 
};
module.exports.PATCH_ANNULER_SUIVIE = async (req, res) => {
  const ID_CONNTECTER = req.user?.payload;
  const {ID_INVITATION} = req.params;

try {
  await UTILISATEURS.findByIdAndUpdate(ID_CONNTECTER, { $pull: {suivies: ID_INVITATION} });
  await UTILISATEURS.findByIdAndUpdate(ID_INVITATION, { $pull: {abonnes: ID_CONNTECTER} });

  LISTE_UTILISATEUR(res)
} catch (error) {
  console.log(error)
  return res
    .status(500)
    .json({ erreur_server: `Le server à rencontré un problème` });
}
 
};
module.exports.PATCH_SUIVRE = async (req, res) => {
  const ID_CONNTECTER = req.user?.payload;
  const {ID_INVITATION} = req.params;

try {
  await UTILISATEURS.findByIdAndUpdate(ID_CONNTECTER, { $push: {suivies: ID_INVITATION} });
  await UTILISATEURS.findByIdAndUpdate(ID_INVITATION, { $push: {abonnes: ID_CONNTECTER} });

  LISTE_UTILISATEUR(res)
} catch (error) {
  console.log(error)
  return res
    .status(500)
    .json({ erreur_server: `Le server à rencontré un problème` });
}
 
};
module.exports.PATCH_ENVOYER_INVITATION = async (req, res) => {
  const ID_CONNTECTER = req.user?.payload;
  const {ID_INVITATION} = req.params;

try {
  await UTILISATEURS.findByIdAndUpdate(ID_CONNTECTER, { $push: {attenteAmis: ID_INVITATION} });
  await UTILISATEURS.findByIdAndUpdate(ID_INVITATION, { $push: {suggestions: ID_CONNTECTER} });

  LISTE_UTILISATEUR(res)
} catch (error) {
  console.log(error)
  return res
    .status(500)
    .json({ erreur_server: `Le server à rencontré un problème` });
}
 
};
module.exports.PATCH_REFUSER_INVITATION = async (req, res) => {
  const ID_CONNTECTER = req.user?.payload;
  const {ID_INVITATION} = req.params;

try {
 
  await UTILISATEURS.findByIdAndUpdate(ID_CONNTECTER, { $pull: {suggestions: ID_INVITATION} });
  await UTILISATEURS.findByIdAndUpdate(ID_INVITATION, { $pull: {attenteAmis: ID_CONNTECTER} });
  LISTE_UTILISATEUR(res)
} catch (error) {
  console.log(error)
  return res
    .status(500)
    .json({ erreur_server: `Le server à rencontré un problème` });
}
 
};
module.exports.PATCH_ACCEPTER_INVITATION = async (req, res) => {
  const ID_CONNTECTER = req.user?.payload;
  const {ID_INVITATION} = req.params;

try {
  await UTILISATEURS.findByIdAndUpdate(ID_CONNTECTER, { $push: {amis: ID_INVITATION} });
  await UTILISATEURS.findByIdAndUpdate(ID_INVITATION, { $push: {amis: ID_CONNTECTER} });

  await UTILISATEURS.findByIdAndUpdate(ID_CONNTECTER, { $pull: {suggestions: ID_INVITATION} });
  await UTILISATEURS.findByIdAndUpdate(ID_INVITATION, { $pull: {attenteAmis: ID_CONNTECTER} });
  LISTE_UTILISATEUR(res)
} catch (error) {
  console.log(error)
  return res
    .status(500)
    .json({ erreur_server: `Le server à rencontré un problème` });
}
 
};
module.exports.PATCH_SUPPRIMER_AMIS = async (req, res) => {
  const ID_CONNTECTER = req.user?.payload;
  const {ID_INVITATION} = req.params;

try {
  await UTILISATEURS.findByIdAndUpdate(ID_CONNTECTER, { $pull: {amis: ID_INVITATION} });
  await UTILISATEURS.findByIdAndUpdate(ID_INVITATION, { $pull: {amis: ID_CONNTECTER} });

  LISTE_UTILISATEUR(res)
} catch (error) {
  console.log(error)
  return res
    .status(500)
    .json({ erreur_server: `Le server à rencontré un problème` });
}
 
};
module.exports.PATCH_ANNULER_INVITATION = async (req, res) => {
  const ID_CONNTECTER = req.user?.payload;
  const {ID_INVITATION} = req.params;

try {
  await UTILISATEURS.findByIdAndUpdate(ID_CONNTECTER, { $pull: {attenteAmis: ID_INVITATION} });
  await UTILISATEURS.findByIdAndUpdate(ID_INVITATION, { $pull: {suggestions: ID_CONNTECTER} });

  LISTE_UTILISATEUR(res)
} catch (error) {
  console.log(error)
  return res
    .status(500)
    .json({ erreur_server: `Le server à rencontré un problème` });
}
 
};

// PUT
module.exports.PUT_MODIFIER_PROFIL = async (req, res) => {
  let { pseudo, naissance, sexe, email } = req.body;
  const ID_CONNTECTER = req.user?.payload;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ erreur_validation: errors.array() });
  }
  try {
    
    const CHERCHER_UTILISATEUR_PSEUDO = await UTILISATEURS.findOne({ pseudo });
    const CHERCHER_UTILISATEUR_EMAIL = await UTILISATEURS.findOne({ email });

          
    if (CHERCHER_UTILISATEUR_PSEUDO  || CHERCHER_UTILISATEUR_EMAIL)
      return res.status(400).json({
        erreur_chercher_utilisateur: `Le pseudo ou l'email existe déja, veuillez en choisisant un autre pseudo ou email `,
      });
  const UTILISATEUR =  await UTILISATEURS.findByIdAndUpdate(ID_CONNTECTER, {
      pseudo,
      naissance,
      sexe,
      email,
    });

    return res.status(200).json({UTILISATEUR });
  } catch (error) {
    return res
      .status(500)
      .json({ erreur_server: `Le server à rencontré un problème` });
  }
};
module.exports.PUT_PASSWORD = async (req, res) => {
  let { ancien_password, nouveau_password, conf_password } = req.body;
  const ID_CONNTECTER = req.user?.payload;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ erreur_validation: errors.array() });
  }
  try {
    if (!ID_CONNTECTER)
      return res
        .status(400)
        .json({ erreur_utilisateur_connect: `Veuillez vous connecter... !` });

    if (nouveau_password !== conf_password)
      return res.status(400).json({
        password_erreur: `Le nouveau mot de passe ne correspond pas à la confirmation`,
      });

    const CHERCHER_UTILISATEUR = await UTILISATEURS.findById(ID_CONNTECTER);

    const VERIFY_PASSWORD = bcrypt.compareSync(
      ancien_password,
      CHERCHER_UTILISATEUR.password
    );

    if (!VERIFY_PASSWORD)
      return res.status(400).json({
        password_erreur: `L'ancien mot de passe n'est pas correct...`,
      });

    const SALT = bcrypt.genSaltSync(10);
    const PASSWORD = bcrypt.hashSync(nouveau_password, SALT);

    await UTILISATEURS.findByIdAndUpdate(ID_CONNTECTER, { password: PASSWORD });

   
      CHERCHER_UTILISATEUR.password = ""; //Vider le contenu de password
      CHERCHER_UTILISATEUR.verification = ""; //Vider le contenu de la verification
      CHERCHER_UTILISATEUR.PasseGenere = ""; //Vider le contenu de passeGene
  console.log(CHERCHER_UTILISATEUR)
    return res.status(200).json({NOUVEAU_CONNECTE : CHERCHER_UTILISATEUR });
  } catch (error) {
    return res
      .status(500)
      .json({ erreur_server: `Le server à rencontré un problème` });
  }
};

// POST
module.exports.POST_INSCRIPTION = async (req, res) => {
  let { pseudo, naissance, sexe, email, password, conf_password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ erreur_validation: errors.array() });
  }
  try {
    if (password !== conf_password)
      return res.status(400).json({
        password_erreur: `Le mot de passe ne correspond pas à la confirmation`,
      });
    const CHERCHER_UTILISATEUR_PSEUDO = await UTILISATEURS.findOne({ pseudo });
    const CHERCHER_UTILISATEUR_EMAIL = await UTILISATEURS.findOne({ email });

    if (CHERCHER_UTILISATEUR_PSEUDO || CHERCHER_UTILISATEUR_EMAIL)
      return res.status(400).json({
        erreur_chercher_utilisateur: `Le pseudo ou l'email existe déja, veuillez vous inscrire en choisisant un autre pseudo ou email `,
      });

    const SALT = bcrypt.genSaltSync(10);
    const PASSWORD = bcrypt.hashSync(password, SALT);

    if (email === process.env.EMAIL_ADMIN) {
      const NOUVEAU_INSCRIT = new UTILISATEURS({
        pseudo,
        naissance,
        sexe,
        email,
        password: PASSWORD,
        admin: true,
        nombreVisite: 0,
      });
      NOUVEAU_INSCRIT.save();
      return res.status(200).json({
        NOUVEAU_INSCRIT: `${pseudo} est bien inscrit, veuillez vous connecter...`,
      });
    }
    const NOUVEAU_INSCRIT = new UTILISATEURS({
      pseudo,
      naissance,
      sexe,
      email,
      password: PASSWORD,
      admin: false,
      nombreVisite: 0,
    });
    NOUVEAU_INSCRIT.save();
    return res.status(200).json({
      NOUVEAU_INSCRIT: `${pseudo} est bien inscrit, veuillez vous connecter...`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ erreur_server: `Le server à rencontré un problème` });
  }
};

module.exports.POST_CONNEXION = async (req, res) => {
  let { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ erreur_validation: errors.array() });
  }

  try {
    const RECHERCHER_EMAIL = await UTILISATEURS.findOne({ email });
    if (!RECHERCHER_EMAIL)
      return res
        .status(400)
        .json({ erreur_chercher_email: `L'email n'est pas trouvé...` });

    const VERIFY_PASSWORD = bcrypt.compareSync(
      password,
      RECHERCHER_EMAIL.password
    );

    if (!VERIFY_PASSWORD)
      return res.status(400).json({
        erreur_chercher_password: `Le mot de passe n'est pas correct...`,
      });

    const token = createToken(RECHERCHER_EMAIL._id.toString());
    res.cookie("access_token", token, {
      // expires: new Date(Date.now() + 3600 * 1000 * 24 * 180 * 1), //second min hour days year
      expires: new Date(Date.now() + 1 * 365 * 24 * 60 * 60 * 1000), //annee jour heure min sec misecc
      path: "/",
      httpOnly: true, // backend only
      sameSite: "strict", // set to none for cross-request
    });

    // const UTILISATEU_CONNTECT = await UTILISATEURS.findById(ID_CONNTECTER);
    RECHERCHER_EMAIL.password = "";

    return res.status(200).json({
      NOUVEAU_CONNECTE: RECHERCHER_EMAIL,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ erreur_server: `Le server à rencontré un problème` });
  }
};

//DELETE

module.exports.DELETE_DECONNEXION = (req, res)=>{    
try {
  res.clearCookie("access_token")
  console.log(req.user)
  return res.status(200).json({deconnexion : 'Vous êtes déconnecté... !'})
} catch (error) {
  console.log(error.message);
  return res
    .status(500)
    .json({ erreur_server: `Le server à rencontré un problème` });
}

}

module.exports.DELETE_UTILISATEUR = async (req, res) => {
  const { ID_SUPPRIMER } = req.params;
  try {
    await UTILISATEURS.findByIdAndDelete(ID_SUPPRIMER);
    const LISTE_UTILISATEUR = await UTILISATEURS.find();
    return res.status(200).json({ LISTE_UTILISATEUR });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ erreur_server: `Le server à rencontré un problème` });
  }
};
