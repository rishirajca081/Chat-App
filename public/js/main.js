const chatform=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');

//username and room

const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
console.log(username,room);

const socket=io();

//join chat room
socket.emit("joinRoom",{username,room});


//get room and user

socket.on('roomUsers',({room,users})=>{
    // console.log(users);
    outputRoomName(room);
    outputUsers(users);
   
})


//msg from server
socket.on("message",message=>{
    outputMessage(message);
   // console.log(message);

    chatMessages.scrollTop=chatMessages.scrollHeight;
});


//Message submit
chatform.addEventListener('submit',(e)=>{
e.preventDefault();
 
 const msg=e.target.elements.msg.value;
 //console.log(msg);

 //sending msg to server
 socket.emit('chatMessage',msg);

 //clear chat
 e.target.elements.msg.value="";
 e.target.elements.msg.focus();

})

function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//room name to dom

function outputRoomName(room){
    roomName.innerText=room;
    // console.log(room);
    // console.log(room+" ");
}

// add usr to dom

 function outputUsers(users){

    userList.innerHTML=`${users.map(user =>`<li>${user.username}<li>`).join('')}`;
}

// function outputUsers(users) {
//     userList.innerHTML = '';
//     users.forEach((user) => {
//       const li = document.createElement('li');
//       li.innerText = user.username;
//       userList.appendChild(li);
//     });
//   }