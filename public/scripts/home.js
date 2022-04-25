var songContainer = document.querySelectorAll("songContainer");
const playBtn = document.getElementById("playBtn");

const audio = document.getElementById("audio");
const title = document.getElementById("songTitle");
const cover = document.getElementById("cover");
const contentList = document.getElementById("contentList");

const newEventModal = document.getElementById("newEventModal");
const newPlaylistModal = document.getElementById("newPlaylistModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const playlistTitleInput = document.getElementById("playlistTitleInput");

let clicked = null;
var songs = [];
var playlists = [];
getSongs();
getPlaylists();

async function getSongs() {
  removeAllChildNodes(contentList);
  await fetch("songs", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "get",
  })
    .then((response) => {
      //console.log(response);
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      data.forEach((x) => {
        songs.push(x);
      });
    })
    .catch((err) => console.log(err));
  createSongDiv();
}

async function getPlaylists() {}

async function createSongDiv() {
  counter = 0;
  await songs.forEach((x) => {
    var li = document.createElement("li");
    var songCont = document.createElement("div");
    var divImg = document.createElement("div");
    var divTitle = document.createElement("div");
    var divBtns = document.createElement("div");
    var playBtn = document.createElement("btn");
    var addBtn = document.createElement("btn");
    var iplay = document.createElement("i");
    var iadd = document.createElement("i");
    var audio = document.createElement("audio");
    var img = document.createElement("img");

    songCont.classList.add(
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "p-2"
    );
    songCont.setAttribute("id", "songContainer");
    divImg.setAttribute("id", "cover-div");
    divTitle.classList.add("songTitle");
    divTitle.setAttribute("id", "songTitle-" + counter);
    divBtns.setAttribute("id", "actionbtn-div");
    playBtn.setAttribute("id", "playBtn");
    addBtn.setAttribute("id", "addToPlaylistBtn-" + counter);
    addBtn.setAttribute("onclick", "addToPlaylist(this)");
    playBtn.classList.add("action-btn");
    addBtn.classList.add("action-btn");
    iplay.classList.add("bi", "bi-play-circle");
    iadd.classList.add("bi", "bi-plus-circle");
    audio.setAttribute("id", "audio");
    img.setAttribute("id", "cover");

    contentList.appendChild(li);
    li.appendChild(songCont);
    songCont.appendChild(divImg);
    divImg.appendChild(img);
    songCont.appendChild(divTitle);
    songCont.appendChild(divBtns);
    divBtns.appendChild(playBtn);
    divBtns.appendChild(addBtn);
    playBtn.appendChild(iplay);
    addBtn.appendChild(iadd);

    divTitle.innerText = x;
    audio.src = `assets/music/${x}`;
    img.src = `assets/images/spotifylogo.jpg`;

    counter++;

    playBtn.addEventListener("click", () => {
      audio.play();
      var isPlaying = songCont.classList.contains("playing");

      if (isPlaying) {
        audio.pause();
        songCont.classList.remove("playing");
        playBtn.querySelector("i.bi").classList.add("bi-play-circle");
        playBtn.querySelector("i.bi").classList.remove("bi-pause-circle");
      } else {
        audio.play();
        songCont.classList.add("playing");
        playBtn.querySelector("i.bi").classList.add("bi-pause-circle");
        playBtn.querySelector("i.bi").classList.remove("bi-play-circle");
      }
    });
  });
}
async function showSongs() {
  removeAllChildNodes(contentList);
  songs = [];
  await fetch("playlistsongs", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "get",
  })
    .then((response) => {
      //console.log(response);
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      data.forEach((x) => {
        songs.push(x);
      });
    })
    .catch((err) => console.log(err));
  createSongDiv();
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
// filter search
function filter() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  ul = contentList;
  li = ul.getElementsByTagName("li");

  for (i = 0; i < li.length; i++) {
    songTitle = li[i].querySelectorAll(".songTitle")[0];
    txtValue = songTitle.textContent || songTitle.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

let songIndex = 0;

function loadSong(song) {
  title.innerText = song;
  audio.src = `assets/music/${song}`;
  cover.src = `assets/images/spotifylogo.jpg`;
}

function openPlaylistModal() {
  newPlaylistModal.style.display = "block";
  backDrop.style.display = "block";
}

function closeModal() {
  newEventModal.style.display = "none";
  newPlaylistModal.style.display = "none";
  backDrop.style.display = "none";
  playlistTitleInput.value = "";
}

function createPlaylist() {
  openPlaylistModal();
}

function savePlaylist() {
  if (playlistTitleInput.value) {
    playlistTitleInput.classList.remove("error");

    fetch("playlist", {
      method: "POST",
      headers: new Headers({
        // Encabezados
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        title: playlistTitleInput.value,
      }),
    })
      .then((response) => {
        //console.log(response);
        if (response.redirected == true) {
          window.location.replace(response.url);
        }
      })
      .catch((e) => console.log(e));

    closeModal();
  } else {
    calendarTitleInput.classList.add("error");
  }
}

function addToPlaylist(btn) {
  str = "songTitle-";
  str += btn.id.slice(-1);
  console.log(str);
  clicked = document.getElementById(str).textContent;
  //console.log(clicked);
  openModal();
  //console.log(playlists);
}

function chosenPlaylist() {
  fetch("playlist", {
    method: "PUT",
    headers: new Headers({
      // Encabezados
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      songs: clicked,
    }),
  })
    .then((response) => {
      //console.log(response);
      if (response.redirected == true) {
        window.location.replace(response.url);
      }
    })
    .catch((e) => console.log(e));
  closeModal();
}

function openModal() {
  newEventModal.style.display = "block";
  backDrop.style.display = "block";
}
