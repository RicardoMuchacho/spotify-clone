const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
  title: {type: String},
  songs: [String],
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  playlists: [playlistSchema],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;