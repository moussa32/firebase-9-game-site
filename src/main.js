import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBz5iBlfU3VmeS7UjGtzdQ5gzmN5LgNmhc",
  authDomain: "al3abmesho-9b0bb.firebaseapp.com",
  databaseURL: "https://al3abmesho-9b0bb-default-rtdb.firebaseio.com",
  projectId: "al3abmesho-9b0bb",
  storageBucket: "al3abmesho-9b0bb.appspot.com",
  messagingSenderId: "194949167953",
  appId: "1:194949167953:web:21e83a12bac5bcb4977170",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// Collection ref
const gamesRef = collection(db, "games");

// queries
const q = query(gamesRef, orderBy("createdAt"));

onSnapshot(q, (snapshot) => {
  let queriedGames = [];
  snapshot.docs.map((doc) => queriedGames.push({ ...doc.data(), id: doc.id }));
});

// get collection data (not in real time)
// getDocs(gamesRef)
//   .then((snapshot) => {
//     let games = [];
//     snapshot.docs.map((doc) => games.push({ ...doc.data(), id: doc.id }));

//     console.log(games);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// get collection data (in real time)
try {
  onSnapshot(gamesRef, (snapshot) => {
    const gameContainer = document.querySelector(".games-container");
    let games = [];
    gameContainer.innerHTML = "";
    snapshot.docs.map((doc) => {
      let createGameCard = document.createElement("div");
      let createGameTitle = document.createElement("h2");
      let createGameID = document.createElement("small");
      let createGameImage = document.createElement("img");
      let createGameDescription = document.createElement("p");

      createGameTitle.innerText = doc.data().title;
      createGameTitle.classList.add("game-name");
      createGameID.textContent = doc.id;
      createGameID.classList.add("game-id");
      createGameCard.classList.add("game-card");
      createGameImage.src = doc.data().image;
      createGameImage.alt = doc.data().title;
      createGameImage.title = doc.data().title;
      createGameImage.classList.add("game-image");
      createGameDescription.innerText = doc.data().description;

      createGameCard.appendChild(createGameTitle);
      createGameCard.appendChild(createGameID);
      createGameCard.appendChild(createGameImage);
      createGameCard.appendChild(createGameDescription);
      gameContainer.appendChild(createGameCard);

      games.push({ ...doc.data(), id: doc.id });
    });

    console.log(games);
  });
} catch (e) {
  console.log(e);
}

const addGameForm = document.querySelector(".addNewGameForm");
addGameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if ((addGameForm.title.value || addGameForm.url.value) === "") {
    console.log("لا تسطيع إرسال البيانات فارغة");
  } else {
    addDoc(gamesRef, {
      title: addGameForm.title.value,
      url: addGameForm.url.value,
      isCommentable: addGameForm.isCommentable.checked,
      published: addGameForm.published.checked,
      image: addGameForm.image.value,
      game: addGameForm.game.value,
      description: addGameForm.description.value,
      seoDescription: addGameForm.seoDescription.value,
      createdAt: serverTimestamp(),
    }).then(() => {
      addGameForm.reset();
    });
  }
});

const deleteGameForm = document.querySelector(".delete-form");
const deletingStatus = document.querySelector(".deleteing-progress");
deleteGameForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "games", deleteGameForm.gameID.value);

  if (deleteGameForm.gameID.value == "") {
    console.log("يجب إدخال المعرف الخاص باللعبة");
  } else {
    deletingStatus.innerHTML = `جاري حذف اللعبة ${deleteGameForm.gameID.value}`;
    console.log(`جاري حذف اللعبة ${deleteGameForm.gameID.value}`);
    deleteDoc(docRef).then(() => {
      deletingStatus.innerHTML = `تم حذف اللعبة ${deleteGameForm.gameID.value} بنجاح`;
      console.log(`تم حذف اللعبة ${deleteGameForm.gameID.value} بنجاح`);
      deleteGameForm.reset();
    });
  }
});

//get a single document
const docRef = doc(db, "games", "AHw4b3rgp8ucE29LxLNI");

getDoc(docRef).then((doc) => {
  console.log(doc.data(), doc.id);
});

onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

const updateForm = document.querySelector(".update-form");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "games", updateForm.gameID.value);
  updateDoc(docRef, {
    title: "updated title",
  });
});

// signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user created:", cred.user);
      signupForm.reset();
    })
    .catch((e) => {
      console.log(e.message);
    });
});

// logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("User signedout");
    })
    .catch((e) => {
      console.log(e);
    });
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((user) => {
      console.log(user);
    })
    .catch((e) => console.log(e.message));
});
