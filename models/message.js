const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Ajouter un getter virtuel pour la propriété 'time'
messageSchema.virtual("time").get(function () {
  // Extraire l'heure et les minutes de la propriété 'createdAt'
  const hours = this.createdAt.getHours();
  const minutes = this.createdAt.getMinutes();

  // Formater le temps en chaîne de caractères
  return `${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
});

// Activer les getters virtuels lors de la conversion d'un document en objet JSON
messageSchema.set("toJSON", { virtuals: true });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
