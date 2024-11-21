import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
        import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
        import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

        const firebaseConfig = {
            apiKey: "AIzaSyDHEcml3aP5X8H6iY3qNnjmoIYKE6WZ4Cc",
            authDomain: "profusion-55ee5.firebaseapp.com",
            projectId: "profusion-55ee5",
            storageBucket: "profusion-55ee5.appspot.com",
            messagingSenderId: "705597166854",
            appId: "1:705597166854:web:f714caa1b9141a93353a87"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth();
        const db = getFirestore();

        function toggleSection(section) {
            document.getElementById('loginSection').style.display = section === 'login' ? 'block' : 'none';
            document.getElementById('registerSection').style.display = section === 'register' ? 'block' : 'none';
            document.getElementById('loginSuccess').style.display = 'none';
        }

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

        function togglePasswordVisibility(passwordId, iconId) {
            const passwordField = document.getElementById(passwordId);
            const eyeIcon = document.getElementById(iconId);

            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                eyeIcon.textContent = '🙈';
            } else {
                passwordField.type = 'password';
                eyeIcon.textContent = '👁';
            }
        }

        function showMessage(message, divId) {
            const messageDiv = document.getElementById(divId);
            messageDiv.style.display = 'block';
            messageDiv.innerHTML = message;
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000)
        }