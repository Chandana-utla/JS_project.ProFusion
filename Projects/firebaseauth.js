
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
  import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"
  import {getFireStore,setDoc,doc} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDHEcml3aP5X8H6iY3qNnjmoIYKE6WZ4Cc",
    authDomain: "profusion-55ee5.firebaseapp.com",
    projectId: "profusion-55ee5",
    storageBucket: "profusion-55ee5.firebasestorage.app",
    messagingSenderId: "705597166854",
    appId: "1:705597166854:web:f714caa1b9141a93353a87"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
//   function showMessage(message,divId)

//   {
//     var messageDiv=document.getElementById(divId);
//      messageDiv.style.display="block";
//      messageDiv.innerHTML=message;
//      messageDiv.style.opacity=1
//      setTimeout(function()
//      {
//         messageDiv.style.opacity=0
//      },5000);

//   }
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    if (messageDiv) {
        messageDiv.style.display = "block";
        messageDiv.innerHTML = message;
        messageDiv.style.opacity = 1;
        setTimeout(function () {
            messageDiv.style.opacity = 0;
            setTimeout(() => {
                messageDiv.style.display = "none"; 
            }, 500);
        }, 5000);
    } else {
        console.error(`Element with id ${divId} not found.`);
    }
}

const createAcc = document.getElementById("CreateAcc");
createAcc.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const auth = getAuth();
    const db = getFireStore();

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            };
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    showMessage("Account created Successfully!", 'signUpMessage');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 5000); 
                })
                .catch((error) => {
                    console.error("Error writing document", error);
                    showMessage("Failed to save user data.", 'signUpMessage');
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email Address already exists', 'signUpMessage');
            } else {
                showMessage('Unable to create User', 'signUpMessage');
            }
        });
});