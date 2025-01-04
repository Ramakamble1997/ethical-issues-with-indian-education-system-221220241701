// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBi8skTqcDfOT_9Cjo9wCvndFoWmjHuN-I",
    authDomain: "blog-9bc6e.firebaseapp.com",
    projectId: "blog-9bc6e",
    storageBucket: "blog-9bc6e.appspot.com",
    messagingSenderId: "774946177600",
    appId: "1:774946177600:web:c79dbb40d798bc196e15a5",
    measurementId: "G-LSX1X32V20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const commentInput = document.getElementById("comment-input");
const submitComment = document.getElementById("submit-comment");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const commentList = document.getElementById("comment-list");

// Google Login
loginBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("User logged in:", result.user);
    } catch (error) {
        console.error("Error during login:", error);
    }
});

// Logout
logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        console.log("User logged out");
    } catch (error) {
        console.error("Error during logout:", error);
    }
});

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";
        submitComment.disabled = false;
    } else {
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";
        submitComment.disabled = true;
    }
});

// Submit Comment
submitComment.addEventListener("click", async () => {
    const user = auth.currentUser;
    const comment = commentInput.value.trim();

    if (!comment) {
        alert("Comment cannot be empty!");
        return;
    }

    if (!user) {
        alert("You need to be logged in to post a comment.");
        return;
    }

    try {
        await addDoc(collection(db, "comments"), {
            comment,
            user: user.email,
            name: user.displayName,
            timestamp: serverTimestamp(),
        });
        commentInput.value = "";
        addNewCommentToPage({
            name: user.displayName,
            user: user.email,
            comment,
        }); // Add the new comment to the page
    } catch (error) {
        console.error("Error posting comment:", error);
    }
});

// Fetch Comments
const fetchComments = async (limit = 50) => {
    commentList.innerHTML = ""; // Clear existing comments

    const q = query(
        collection(db, "comments"),
        orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        addNewCommentToPage(data); // Render each comment
    });
};

// Add New Comment to Page
const addNewCommentToPage = (data) => {
    const commentEl = document.createElement("div");
    commentEl.classList.add("comment");
    commentEl.innerHTML = `
        <strong>${data.name}</strong>
        <p>${data.comment}</p>
    `;
    commentList.prepend(commentEl); // Add to the top of the comment list
};

// Fetch comments on load
fetchComments();
