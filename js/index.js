// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBi8skTqcDfOT_9Cjo9wCvndFoWmjHuN-I",
    authDomain: "blog-9bc6e.firebaseapp.com",
    projectId: "blog-9bc6e",
    storageBucket: "blog-9bc6e.firebasestorage.app",
    messagingSenderId: "774946177600",
    appId: "1:774946177600:web:c79dbb40d798bc196e15a5",
    measurementId: "G-LSX1X32V20"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const commentInput = document.getElementById("comment-input");
const submitComment = document.getElementById("submit-comment");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const commentList = document.getElementById("comment-list");

loginBtn.addEventListener("click", async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";
        submitComment.disabled = false;
    } catch (error) {
        console.error("Error during login:", error);
    }
});

logoutBtn.addEventListener("click", async () => {
    await auth.signOut();
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    submitComment.disabled = true;
});

submitComment.addEventListener("click", async () => {
    const user = auth.currentUser;
    const comment = commentInput.value.trim();

    if (!comment) return alert("Comment cannot be empty!");

    try {
        await db.collection("comments").add({
            comment,
            user: user.email,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        commentInput.value = "";
        fetchComments();
    } catch (error) {
        console.error("Error posting comment:", error);
    }
});

const fetchComments = async () => {
    commentList.innerHTML = ""; // Clear existing comments
    const querySnapshot = await db.collection("comments").orderBy("timestamp", "desc").get();

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const commentEl = document.createElement("div");
        commentEl.classList.add("comment");
        commentEl.innerHTML = `
            <strong>${data.name || "Anonymous"} (${data.user})</strong>
            <p>${data.comment}</p>
        `;
        commentList.appendChild(commentEl);
    });
};

fetchComments();
