import { app } from "./firebase.js";

import {
  getDatabase,
  ref,
  set,
  onValue,
  child,
  remove,
  get,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

const database = getDatabase(app);

const name = document.getElementById("name");
const model = document.getElementById("model");
const description = document.getElementById("info");
const date = document.getElementById("date");
const status = document.getElementById("status");
const confirmBtn = document.getElementById("confirmBtn");
const update = document.getElementById("update");
const container = document.querySelector(".container");
const removeBtn = document.getElementById("remove");

confirmBtn.addEventListener("click", (e) => {
  e.preventDefault();

  set(ref(database, "Automobilis/" + name.value), {
    Name: name.value,
    Model: model.value,
    Description: description.value,
    Date: date.value,
    Status: status.value,
  })
    .then(() => {
      console.log("Data inserted successfully");
    })
    .catch((error) => {
      console.error("Error inserting data: ", error);
    });
});

onValue(ref(database, "Automobilis/" + name.value), (snapshot) => {
  const data = snapshot.val();
  const dbRef = ref(getDatabase());
  get(child(dbRef, `Automobilis/${name.value}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        container.innerHTML = "";
        snapshot.forEach((el) => {
          console.log(el.val());
          const row = document.createElement("tr");

          const idCell = document.createElement("h3");
          idCell.textContent = Object.values(el.val());
          row.appendChild(idCell);

          container.appendChild(row);
        });
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  console.log(data);
});

removeBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const dbRef = ref(getDatabase());
  const carRef = child(dbRef, "Automobilis/" + name.value);

  get(carRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        remove(carRef)
          .then(() => {
            console.log("Data deleted successfully");
          })
          .catch((error) => {
            console.error(error);
            alert("Error deleting data");
          });
      } else {
        console.log("No data available");
        alert("Data not found");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Error fetching data");
    });
});
