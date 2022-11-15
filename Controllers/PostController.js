const POSTER_UTILISATEURS = require("../Models/Posts");
const UTILISATEURS = require("../Models/Utilisateurs");
const { validationResult } = require("express-validator");

module.exports.GET_LISTE_POSTER = async (req, res) => {
  try {
    const LISTE_POSTER = await POSTER_UTILISATEURS.find().sort({
      createdAt: -1,
    });
    return res.status(200).json({
      LISTE_POSTER,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ erreur_server: `Le server à rencontré un problème` });
  }
};
//post image et le texte du post
module.exports.POST_POSTER = async (req, res) => {
  console.log(req.file)
  const ID_CONNTECTER = req.user?.payload;
  if(!ID_CONNTECTER) 
  return console.log('ID_CONNECT :' + ID_CONNTECTER);

  const post_texte = req.body.post_texte ;
  try {
    if (!req.file) {
      const NEW_POSTER_TEXTE = new POSTER_UTILISATEURS({
        posterId: ID_CONNTECTER,
        postTexte: post_texte,
      });

      NEW_POSTER_TEXTE.save();
    }
    if (req.file?.mimetype == "image/png" || req.file?.mimetype ==  "image/jpeg"  || req.file?.mimetype ==  "image/jpg") {
     
      if(post_texte !=  'undefined'){
        const NEW_POSTER_IMAGE = new POSTER_UTILISATEURS({
        posterId: ID_CONNTECTER,
        postTexte: post_texte,
        postPhoto: req.file.filename,
      });
      NEW_POSTER_IMAGE.save();
      }else{
        const NEW_POSTER_IMAGE = new POSTER_UTILISATEURS({
          posterId: ID_CONNTECTER,
          postPhoto: req.file.filename,
        });
        NEW_POSTER_IMAGE.save();
      }
      
    }
    if (req.file?.mimetype == "video/mp4") {
      if(post_texte != 'undefined'){
         const NEW_POSTER_VIDEO = new POSTER_UTILISATEURS({
        posterId: ID_CONNTECTER,
        postTexte: post_texte,
        postVideo: req.file.filename,
      });

      NEW_POSTER_VIDEO.save();
      }else{
        const NEW_POSTER_VIDEO = new POSTER_UTILISATEURS({
          posterId: ID_CONNTECTER,
          postVideo: req.file.filename,
        });
  
        NEW_POSTER_VIDEO.save();
      }
     
    }
    const POSTER_AFFICHE_UTILISATEURS = await POSTER_UTILISATEURS.find();
    return res.status(200).json({ POSTER_AFFICHE_UTILISATEURS });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ erreur_server: `Le server à rencontré un problème` });
  }
};

//Partie aimer un poster
module.exports.PUT_POSTER_LIKES = async (req, res) => {
  const ID_CONNTECTER = req.user?.payload;
  const ID_POST = req.params.id_post;
  try {
    const POST_UTILISATEUR_EXISTE = await POSTER_UTILISATEURS.findById(ID_POST);
    if (!POST_UTILISATEUR_EXISTE)
      return res.status(400).json({
        POSTER_UTILISATEUR_EXISTANT: `Ce post ${ID_POST} n'existe pas`,
      });

    await UTILISATEURS.findByIdAndUpdate(ID_CONNTECTER, {
      $push: { likes: ID_POST },
    });
    await POSTER_UTILISATEURS.findByIdAndUpdate(ID_POST, {
      $push: { postNombreLike: ID_CONNTECTER },
    });

    const POSTER_AFFICHE = await POSTER_UTILISATEURS.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({ POSTER_AFFICHE });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ erreur_server: `Le server à rencontré un problème` });
  }
};

//Partie supprimer un poster
module.exports.DELETE_POST_POSTER = async (req, res) => {
  const ID_POST = req.params.id_post;
  try {
    await POSTER_UTILISATEURS.findByIdAndDelete(ID_POST);
    const AFFICHER_POSTE = await POSTER_UTILISATEURS.find().sort({
      createdAt: -1,
    });
    return res.status(200).json({
      AFFICHER_POSTE,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ erreur_server: `Le server à rencontré un problème` });
  }
};

//Partie ne plus aimé un poster
module.exports.PUT_POSTER_UNLIKES = async (req, res) => {
  const ID_CONNTECTER = req.user?.payload;
  const ID_POST = req.params.id_post;
  try {
    await UTILISATEURS.findByIdAndUpdate(ID_CONNTECTER, {
      $pull: { likes: ID_POST },
    });
    await POSTER_UTILISATEURS.findByIdAndUpdate(ID_POST, {
      $pull: { postNombreLike: ID_CONNTECTER },
    });

    const POSTER_AFFICHE = await POSTER_UTILISATEURS.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({ POSTER_AFFICHE });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ erreur_server: `Le server à rencontré un problème` });
  }
};

module.exports.PUT_POSTER_COMMENTAIRE = async (req, res) => {
  const ID_CONNTECTER = req.user?.payload;
  const postCommentaire = req.body.postCommentaire;
  const ID_POST = req.params.id_post;

  //Capture des erreur au cours de la validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ erreur_validation: errors.array() });
  }

  try {
    await POSTER_UTILISATEURS.findByIdAndUpdate(ID_POST, {
      $push: {
        postCommentaire: {
          post_commentaire_id_utilisateur: ID_CONNTECTER,
          post_commentaire_utilisateur_texte: postCommentaire,
        },
      },
    });

    const POSTER_AFFICHE = await POSTER_UTILISATEURS.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({ POSTER_AFFICHE });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ erreur_server: `Le server à rencontré un problème` });
  }
};

//Supprimer commentaire d'un poste
module.exports.DELETE_POSTER_COMMENTAIRE = async (req, res) => {
  const POST_ID_COMMENTAIRE = req.body.postCommentaireId;
  const ID_POST = req.params.id_post;

  try {
    await POSTER_UTILISATEURS.findByIdAndUpdate(ID_POST, {
      $pull: {
        postCommentaire: {
          _id: POST_ID_COMMENTAIRE,
        },
      },
    });
    const AFFICHER_POSTE = await POSTER_UTILISATEURS.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      AFFICHER_POSTE,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ erreur_server: `Le server à rencontré un problème` });
  }
};
