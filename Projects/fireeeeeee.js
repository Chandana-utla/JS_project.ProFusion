import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDHEcml3aP5X8H6iY3qNnjmoIYKE6WZ4Cc",
    authDomain: "profusion-55ee5.firebaseapp.com",
    projectId: "profusion-55ee5",
    storageBucket: "profusion-55ee5.appspot.com",
    messagingSenderId: "705597166854",
    appId: "1:705597166854:web:f714caa1b9141a93353a87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

// Function to handle user registration
document.getElementById("CreateAcc").addEventListener("click", () => {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').innerText = 'Passwords do not match.';
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = { email, password };

            return setDoc(doc(db, "users", user.uid), userData);
        })
        .then(() => {
            showMessage("Account created successfully!", "signUpMessage");
            toggleSection('login');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = errorCode === 'auth/email-already-in-use'
                ? 'Email address already in use.'
                : 'Failed to create account.';
            showMessage(errorMessage, "signUpMessage");
        });
});

// Function to handle user login
function validateLoginForm() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            document.getElementById('loginSuccess').style.display = 'block';
        })
        .catch(() => {
            document.getElementById('loginPasswordError').innerHTML = 'Invalid email or password.';
        });

    return false;
}

// Function to upload content (thoughts and files) to Firebase Firestore and Storage
function uploadContent() {
    const fileInput = document.getElementById('contentFile');
    const thoughtsInput = document.getElementById('creatorThoughts');
    const creatorNameInput = document.getElementById('creatorName');

    const creatorName = creatorNameInput.value.trim();
    const userThoughts = thoughtsInput.value.trim();
    const file = fileInput.files[0];

    if (!creatorName) {
        alert("Please enter your name!");
        return;
    }

    if (!userThoughts && !file) {
        alert("Please write your thoughts or upload a file!");
        return;
    }

    // Upload file to Firebase Storage
    let fileURL = null;
    if (file) {
        const storageRef = ref(storage, 'uploads/' + file.name);
        uploadBytes(storageRef, file).then((snapshot) => {
            // Get the file's URL after uploading
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                fileURL = downloadURL;
                saveContentToFirestore(creatorName, userThoughts, file.name, fileURL);
            });
        }).catch((error) => {
            alert("Error uploading file: " + error.message);
        });
    } else {
        saveContentToFirestore(creatorName, userThoughts, "No file uploaded", null);
    }
}

// Function to save content data (name, thoughts, file URL) to Firestore
function saveContentToFirestore(creatorName, thoughts, fileName, fileURL) {
    const contentData = {
        creatorName,
        thoughts,
        fileName,
        fileURL,
        timestamp: new Date()
    };

    // Save content to Firestore
    setDoc(doc(db, "content", creatorName + "_" + new Date().getTime()), contentData)
        .then(() => {
            alert("Content uploaded successfully!");
            clearFormFields();
        })
        .catch((error) => {
            alert("Error saving content to Firestore: " + error.message);
        });
}

// Function to clear the form fields after successful content upload
function clearFormFields() {
    document.getElementById('creatorName').value = '';
    document.getElementById('creatorThoughts').value = '';
    document.getElementById('contentFile').value = '';
}

// Function to display a message in the UI
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = 'block';
    messageDiv.innerHTML = message;
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}
