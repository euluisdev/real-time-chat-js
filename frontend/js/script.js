const login = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const loginInput = document.querySelector('.login-input');
const chat = document.querySelector('.chat');
const chatForm = document.querySelector('.chat-form');
const chatInput = document.querySelector('.chat-input');
const chatMsg = document.querySelector('.chat-msg');

//Object to store user information
const user = { id: '', name: '', color: '' };

const useer = { id: '', name: '', color: '' }

//array of the colors available
const colors = [
    'cadetblue',
    'darkgoldenrod',
    'cornflowerblue',
    'darkkhaki',
    'hotpink',
    'gold',
    'coral',
    'cyan'
];

let websocket; //this stores the WebSocket connection

//creates a message of  self user
const createMsgSelf = (content) => {
    const div = document.createElement('div');
    div.classList.add('msg-self');
    div.innerHTML = content;

    return div;
};

// creates a message of  other user
const createMsgOther = (content, sender, senderColor) => {
    const div = document.createElement('div');
    const span = document.createElement('span');

    div.classList.add('msg-other');
    span.classList.add('msg-sender');
    span.style.color = senderColor;

    div.appendChild(span);

    span.innerHTML = sender;
    div.innerHTML += content;

    return div;
};

const randomColor = () => {  //generates random color
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};


const scrollScreen = () => { //calls the scroll bar down
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'  //gently
    })
};

// function to process messages received by WebSocket
const processMsg = ({ data }) => {
    const { userName, userId, userColor, content } = JSON.parse(data);

    const message = userId == user.id 
    ? createMsgSelf(content) 
    : createMsgOther(content, userName, userColor);

    chatMsg.appendChild(message);  //msg in the screen

    scrollScreen();  //scroll bar down
};

//  this handles sending messages
const handleLogin = (event) => {
    event.preventDefault(); //not update the form after press the button

    //thisfills in the user information
    user.name = loginInput.value
    user.id = crypto.randomUUID()
    user.color = randomColor();

    login.style.display = 'none';
    chat.style.display = 'flex';

    //starts the WebSocket connection
    websocket = new WebSocket('ws://localhost:8080');

    //Configures the function to process messages received by WebSocket
    websocket.onmessage = processMsg; 
};

const sendMsg = (event) => {
    event.preventDefault(); // not  update the form after press the button

    //Creates a message object with the user information and message content
    const message = {
        userName: user.name,
        userId: user.id,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message));
    chatInput.value = '';    
}

loginForm.addEventListener('submit', handleLogin);
chatForm.addEventListener('submit', sendMsg);