const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = new Schema({
  title: {type: String},
  times_played: Number,
}, { timestamps: true });

const Song = mongoose.model('Song', songSchema);
module.exports = Song;