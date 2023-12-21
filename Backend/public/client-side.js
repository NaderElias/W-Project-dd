// const socket = io("http://localhost:3000");
// const messageInput = document.getElementById("messageInput");
// const sendButton = document.getElementById("sendButton");
// const messagesDiv = document.getElementById("messages");
// const startChatButton = document.getElementById("startChatButton");
// const notificationsDiv = document.getElementById("notifications"); // Assuming you have a div for notifications

// sendButton.addEventListener("click", () => {
//   const message = messageInput.value;
//   messageInput.value = "";
//   socket.emit("chat message", message);
// });

// startChatButton.addEventListener("click", () => {
//   const userInfo = {
//     /* user's information */
//   };
//   socket.emit("start chat", userInfo);
// });

// socket.on("chat message", (message) => {
//   const messageElement = document.createElement("p");
//   messageElement.textContent = message;
//   messagesDiv.appendChild(messageElement);
// });

// // Handle 'new notification' event
// socket.on("new notification", (notification) => {
//   console.log("New notification received:", notification);
//   const notificationElement = document.createElement("p");
//   notificationElement.textContent = notification.message;
//   notificationsDiv.appendChild(notificationElement);
// });

// socket.on("connect", () => {
//   console.log("Connected to the server");
// });

// socket.on("welcome", (message) => {
//   console.log(message);
// });

// socket.on("disconnect", () => {
//   console.log("Disconnected from the server");
// });
// socket.on("chat started", (userInfo) => {
//   console.log("Chat started with user: " + userInfo);
//   // Display the chat interface
// });
