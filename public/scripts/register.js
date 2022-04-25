const username = document.getElementById("name");
const pass = document.getElementById("pass");
const email = document.getElementById("email");

const error = document.getElementById("error");

function register() {
  fetch("register", {
    method: "POST",
    headers: new Headers({
      // Encabezados
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      name: username.value,
      pass: pass.value,
      email: pass.value,
    }),
  })
    .then((response) => {
      console.log(response);
      if (response.redirected == true) {
        window.location.replace(response.url);
      }
      return response.json();
    })
    .then((r) => {
      console.log(r);
    })
    .catch((e) => console.log(e));
}
