const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
  user_id: mongoose.ObjectId,
  title: {type: String, required: true},
  songs: [String],
  followed_times: Number,
}, { timestamps: true });

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;