const mongoose = require("mongoose");

const UTILISATEUR_SCHEMA = new mongoose.Schema({
  photo_profil: {
    type: String,
  },
  photo_couverture: {
    type: String,
  },
  pseudo: {
    type: String,
    required: true,
    lowercase: true,
    minLength: 3,
    maxLength: 25,
    unique: true,
    trim: true,
  },
  naissance: {
    type: String,
    trim: true,
    required: true,
  },
  sexe: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    minlength: 6,
  },
  nombreVisite: {
    type: Number,
    required: true,
  },
  verification: {
    type: String,
  },
  PasseGenere:{
    type: String,
    trim: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
  active: {
    type: Boolean,
    trim: true,
  },
  amis: {
    type: [String],
  },
  attenteAmis: {
    type: [String],
  },
  suggestions: {
    type: [String],
  },
  abonnes: {
    type: [String],
  },
  suivies: {
    type: [String],
  },
  enLigne: {
    type: [String],
  },
  likes: {
    type: [String],
  }
  ,
  dateInscription: {
    type: Date,
    default: Date.now(),
  },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model("UTILISATEUR", UTILISATEUR_SCHEMA);
