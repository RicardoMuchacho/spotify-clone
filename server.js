const dotenv = require("dotenv").config();

const express = require("express");
const path = require("path");
const morgan = require("morgan");
var session = require("express-session");
const fs = require("fs");
const db = require("./db.js");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");

const User = require("./models/user");
const Playlist = require("./models/playlist");
const Song = require("./models/song");

mongoose.set("useFindAndModify", false);

app.use(session({ secret: "secret", saveUninitialized: true, resave: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/login", async (req, res) => {
  try {
    username = req.body.name;
    pass = req.body.pass;

    const user = await User.findOne({ name: username });
    console.log(user);
    if (username == user.name && (await bcrypt.compare(pass, user.password))) {
      req.session.userid = user._id;
      req.session.name = user.name;
      req.session.email = user.email;
      req.session.password = user.password;

      Playlist.find({ user_id: user._id }, function (err, playlists) {
        if (err) return console.log(err);

        var favExists = false;
        playlists.forEach((p) => {
          if (p.title == "favorites") {
            favExists = true;
          }
        });
        if (favExists == false) {
          db.addPlaylist(user._id, "favorites");
        }
      });

      res.redirect("/home");
    }
  } catch {
    (error) => console.log(error);
    res.send(JSON.stringify("Error: User not found"));
  }
  //res.sendFile(path.join(__dirname, 'public/home.html'));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public/register.html"));
});

app.post("/register", async (req, res) => {
  try {
    regusername = req.body.name;
    regpassword = req.body.pass;
    email = req.body.email;

    console.log(regusername, regpassword, email);

    const old_user = await User.findOne({ name: regusername });
    console.log(old_user);
    if (old_user) {
      return res.send(JSON.stringify("User Already Exist. Please Login"));
    }

    encryptedPassword = await bcrypt.hash(regpassword, 10);
    console.log(encryptedPassword);

    const new_user = await User.create({
      name: regusername,
      email: email,
      password: encryptedPassword,
    });

    //res.json(new_user);
    res.redirect("/");
  } catch {
    (err) => console.log(err);
  }
});

app.get("/signout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/users", (req, res) => {
  res.sendFile(path.join(__dirname, "public/users.html"));
});

app.delete("/users", (req, res) => {
  db.deleteUser(req.session.userid);
  res.redirect("/signout");
});

app.put("/users", (req, res) => {
  try {
    newName = req.body.name;
    newPass = req.body.pass;
    newEmail = req.body.email;
    db.updateUser(req.session.userid, newName, newEmail, newPass);

    req.session.name = newName;
    req.session.email = newEmail;
    req.session.password = newPass;
    res.send(JSON.stringify("Succesful"));
    res.redirect("/users");
  } catch {
    (err) => console.log(err);
  }
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public/home.html"));
});

app.get("/songs", (req, res) => {
  filenames = fs.readdirSync("public/assets/music");
  res.send(filenames);
  console.log(filenames);
});

app.get("/userinfo", (req, res) => {
  sid = req.session.userid;
  sname = req.session.name;
  semail = req.session.email;
  spass = req.session.password;
  res.send(
    JSON.stringify({ id: sid, name: sname, email: semail, password: spass })
  );
});

app.get("/playlist", (req, res) => {
  Playlist.find({ user_id: req.session.userid }, function (err, playlists) {
    if (err) return console.log(err);

    res.send(playlists);
  });
});

app.post("/playlist", (req, res) => {
  playlistTitle = req.body.title;
  db.addPlaylist(req.session.userid, playlistTitle);
  res.send("playlist saved");
});

app.put("/playlist", (req, res) => {
  putSongs = req.body.songs;
  db.updatePlaylist(req.session.userid, "favorites", putSongs);
  res.send("songs saved to playlist");
});

app.get("/playlistsongs", (req, res) => {
  strSongs = [];
  Playlist.findOne(
    { user_id: req.session.userid, title: "favorites" },
    function (err, playlist) {
      if (err) return console.log(err);
      console.log(playlist.songs);
      playlist.songs.forEach((x) => {
        strSongs.push(x);
      });
      console.log(strSongs);

      res.send(strSongs);
    }
  );
});

/*
app.get('/api/sum/:n1/:n2', (req, res)=>{
    
    n1 =(parseInt(req.params.n1));
    n2 =(parseInt(req.params.n1));
    r = n1 + n2;
    res.send(`the sum of ${n1} + ${n2} = ` + JSON.stringify(r));
    //res.send(JSON.stringify());
});*/

const PORT = process.env.PORT || 3000;
/*
app.listen(PORT, ()=>{
    console.log('Listening on port ' + PORT + '...')
});*/

const dbURI = process.env.MONGO_URI;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Listening on Port:" + PORT);
    console.log("connected to db");
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
