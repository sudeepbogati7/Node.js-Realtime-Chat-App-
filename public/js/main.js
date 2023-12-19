const chat_form = document.getElementById("chat-form");
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// get username and room from URL 
const { username , room } = Qs.parse(location.search, {
    ignoreQueryPrefix : true
});

const socket = io();


// Join chatroom 
socket.emit('joinRoom', ({username, room}))

// get room and users 
socket.on('roomUsers' , ({ room , users }) => {
    displayRoomName(room);
    displayUsers(users);
});


chat_form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // get the message text
    const msg = e.target.elements.msg.value;

    // emit messge to the server 
    socket.emit('chatMessage',msg );

    //clear the input form
    e.target.elements.msg.value = "";
});


// ------------message from server ----------------
socket.on('message', message => {
    console.log(message);
    displayMessage(message);

    //scroll down 
    chatMessage.scrollTop = chatMessage.scrollHeight;
});


// Display message to DOM 

function displayMessage(message){
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`

    document.querySelector('.chat-messages').appendChild(div);
}


// add room room name to DOM 
function displayRoomName(room){
    roomName.innerText = room ;
}

//  add users to DOM
function displayUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}`
}