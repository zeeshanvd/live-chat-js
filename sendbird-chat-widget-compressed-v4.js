(function(){const scriptTag=document.currentScript;const BUSINESS_ID=scriptTag.getAttribute('data-business-id');const APP_ID='395F268A-A8C2-4901-A68B-D3003128F88D';const sendbirdScript=document.createElement('script');sendbirdScript.src="https://cdn.jsdelivr.net/npm/sendbird@3.1.33/SendBird.min.js";const userIcon="https://cdn-icons-png.flaticon.com/128/847/847969.png";sendbirdScript.onload=initializeChatWidget;document.head.appendChild(sendbirdScript);function initializeChatWidget(){const style=document.createElement('style');style.textContent=`
  body{font-family:Arial,sans-serif}#chat-container{display:flex;flex-direction:column-reverse;height:65%;overflow-y:auto;padding:10px;border:1px solid #ccc;border-radius:5px;background-color:#fff;margin-bottom:10px}#chat-section-header{display:block;line-height:1px;font-size:1.5em;margin-block-start:.83em;margin-block-end:.83em;margin-inline-start:0;margin-inline-end:0;font-weight:700;unicode-bidi:isolate}#chat-section{flex:1;margin:0 auto;padding:0 10px 0 10px;border:1px solid #ccc;border-radius:5px;background-color:#f9f9f9;display:none;flex-direction:column;height:inherit;overflow-y:auto}#message-input{width:100%;padding:10px;box-sizing:border-box;border:1px solid #ccc;border-radius:5px}.message{align-items:center;margin-bottom:10px;padding:10px;border-radius:5px;max-width:80%}.message.user{background-color:#1a76d1;color:#fff;align-self:flex-end}.message.other{background-color:#ececec;align-self:flex-start}.message img{width:30px;height:30px;border-radius:50%;border:1.5px solid lightgray;margin-right:10}.message.user img{margin-right:10}.message .message-content{display:flex;align-items:center;margin-bottom:8px}.message .message-content .message-header{display:flex;align-items:center}.message .message-content .message-sender{font-weight:700;margin:0 10px 0 10px}.message .message-text{word-wrap:break-word;line-break:auto}.message .message-text a{text-decoration:underline}#send-button{height:35px;width:60px;padding:10px;background-color:#1A76D1;color:#fff;border:none;border-radius:5px;cursor:pointer;margin-left:10px}#form-container{display:none}#sendbird-widget{position:fixed;bottom:10px;right:20px;width:50px;height:50px;background-color:#1A76D1;border-radius:50%;display:flex;justify-content:center;align-items:center;cursor:pointer;z-index:9999}#sendbird-widget:after{content:"💬";font-size:30px;color:#fff}#sendbird-chat-container{display:none;position:fixed;bottom:70px;right:10px;width:300px;height:400px;background-color:#fff;border:1px solid #ccc;border-radius:10px;box-shadow:0 0 10px rgb(0 0 0 / .1);z-index:9999}#user-form{max-width:400px;margin:0 auto;padding:20px;border-radius:5px}#user-form label{display:block;margin-bottom:8px;font-weight:700}#user-form input{width:100%;padding:8px;margin-bottom:16px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box}#user-form button{width:100%;padding:10px;background-color:#1A76D1;color:#fff;border:none;border-radius:4px;cursor:pointer;bottom:0}#user-form button:hover{background-color:#1973cc}#send-button:hover{background-color:#1973cc}#input-container{display:flex;align-items:center}#user-status{height:10px;width:10px;border-radius:5px;margin:3px;background-color:gray;display:inline-block;margin-right:10px}
`;document.head.appendChild(style);const widgetHtml=`
  <div id=sendbird-widget></div><div id=sendbird-chat-container style=display:none><div id=form-container style=display:none><form id=user-form onsubmit=submitForm(event)><label for=email>Email:</label> <input id=email name=email required type=email><br><label for=phone>Phone Number:</label> <input id=phone name=phone required type=tel><br><label for=username>Name:</label> <input id=username name=username required><br><br><button type=submit>Start Chat</button></form></div><div id=chat-section style=display:none><div id=chat-section-header><div id=user-status></div>Live Chat</div><div id=chat-container><div id=chat-loader style=display:none>Loading...</div></div><div id=input-container><input id=message-input placeholder="Type your message here..."> <button id=send-button>Send</button></div></div></div>
`;document.body.insertAdjacentHTML('beforeend',widgetHtml);document.getElementById('message-input').addEventListener('keydown',function(event){if(event.key==='Enter'){event.preventDefault();document.getElementById('send-button').click()}});const sb=new SendBird({appId:APP_ID});function initiateChat(userInfo,firstMessage=!1){console.log('Initiating chat with:',userInfo);document.getElementById('chat-loader').style.display='block';sb.connect(userInfo.username,function(user,error){if(error){console.error('Connection failed:',error);return}
console.log('Connected to Sendbird as:',user);sb.updateCurrentUserInfo(userInfo.username,null,function(response,error){if(error){console.error('Failed to update user info:',error);return}});let channelUrl='';const params=new sb.GroupChannelParams();params.addUserIds([userInfo.username,BUSINESS_ID]);params.isDistinct=!0;params.name=userInfo.username;params.nickname=userInfo.username;params.channelName=userInfo.username;sb.GroupChannel.createChannel(params,async function(groupChannel,error){if(error){console.error('Channel creation failed:',error);return}
channelUrl=groupChannel.url;const messageListParams=new sb.MessageListParams();messageListParams.prevResultSize=1;groupChannel.getMessagesByTimestamp(Date.now(),messageListParams,function(messages,error){if(error){console.log("Error fetching messages:",error);return}
if(messages.length===0&&firstMessage){const user=JSON.stringify(userInfo);const messageText=user;document.getElementById('chat-loader').style.display='none';sendMessage(messageText)}
getAllMessages(channelUrl);setupMessageHandler(channelUrl);setupUserEventHandler()})});document.getElementById('send-button').onclick=function(){const messageText=document.getElementById('message-input').value;sendMessage(messageText)};function getAllMessages(channelUrl){sb.GroupChannel.getChannel(channelUrl,async function(groupChannel,error){if(error){console.error('Channel retrieval failed:',error);return}
const messageListParams=new sb.MessageListParams();messageListParams.prevResultSize=100;groupChannel.getMessagesByTimestamp(Date.now(),messageListParams,function(messages,error){if(error){console.log("Error fetching messages:",error);return}
console.log("Fetched messages:",messages);if(messages.length>0){displayMessages(messages)}
if(messages.length===100){const oldestMessageTimestamp=messages[messages.length-1].createdAt;messageListParams.prevResultSize=100;groupChannel.getMessagesByTimestamp(oldestMessageTimestamp,messageListParams,function(nextMessages,error){if(error){console.log("Error fetching next page of messages:",error);return}
console.log("Fetched more messages:",nextMessages);displayMessages(nextMessages)})}})})}
function setupMessageHandler(channelUrl){const ChannelHandler=new sb.ChannelHandler();setupUserEventHandler();ChannelHandler.onMessageReceived=function(channel,message){if(channel.url===channelUrl){displayMessage(message)}};sb.addChannelHandler('unique-handler-id',ChannelHandler)}
function setupUserEventHandler(){const UserEventHandler=new sb.UserEventHandler();UserEventHandler.onUserOnline=function(user){console.log('--------STATUS--ON------',user);if(user.userId===BUSINESS_ID){console.log('User is online:',user);document.getElementById('user-status').style.backgroundColor='green'}};UserEventHandler.onUserOffline=function(user){console.log('--------STATUS--OFF------',user);if(user.userId===BUSINESS_ID){console.log('User is offline:',user);document.getElementById('user-status').style.backgroundColor='gray'}};sb.addUserEventHandler('unique-user-handler-id',UserEventHandler)}
function sendMessage(messageText){if(messageText.trim()===''){console.warn('Cannot send an empty message');return}
console.log('Sending message:',messageText);sb.GroupChannel.getChannel(channelUrl,function(groupChannel,error){if(error){console.error('Failed to get channel:',error);return}
groupChannel.sendUserMessage(messageText,function(message,error){if(error){console.error('Message sending failed:',error);return}
console.log('Message sent:',message);getAllMessages(channelUrl);displayMessage(message);document.getElementById('message-input').value=''})})}})}
function displayMessage(message){let messageValue;if(isJson(message.message)){try{const messageObj=JSON.parse(message.message);messageValue=`
Email: ${messageObj.email}<br>Phone No: ${messageObj.phoneNumber}<br>Name: ${messageObj.username}`}catch(e){console.error('Invalid JSON message:',message.message);messageValue=message.message}}else{messageValue=message.message}
const urlRegex=/(https?:\/\/[^\s]+)/g;const formattedMessage=messageValue.replace(urlRegex,function(url){return `<a href="${url}" target="_blank">${url}</a>`});const messagesContainer=document.getElementById('chat-container');const messageDiv=document.createElement('div');messageDiv.className=`message ${message._sender.userId === sb.currentUser.userId ? 'user' : 'other'}`;const profileImg=document.createElement('img');profileImg.src=message._sender.profileUrl||userIcon;const messageContent=document.createElement('div');messageContent.className='message-content';const messageSender=document.createElement('div');messageSender.className='message-sender';messageSender.textContent=message._sender.nickname;const messageText=document.createElement('div');messageText.className='message-text';messageText.innerHTML=formattedMessage;messageContent.appendChild(profileImg);messageContent.appendChild(messageSender);messageDiv.appendChild(messageContent);messageDiv.appendChild(messageText);messagesContainer.insertBefore(messageDiv,messagesContainer.firstChild);messagesContainer.scrollTop=messagesContainer.scrollHeight}
function displayMessages(messages){const messagesContainer=document.getElementById('chat-container');messagesContainer.innerHTML='';messages.reverse().forEach(message=>{let messageValue;if(isJson(message.message)){try{const messageObj=JSON.parse(message.message);messageValue=`
Email: ${messageObj.email}<br>Phone No: ${messageObj.phoneNumber}<br>Name: ${messageObj.username}`}catch(e){console.error('Invalid JSON message:',message.message);messageValue=message.message}}else{messageValue=message.message}
const urlRegex=/(https?:\/\/[^\s]+)/g;const formattedMessage=messageValue.replace(urlRegex,function(url){return `<a href="${url}" target="_blank">${url}</a>`});const messageDiv=document.createElement('div');messageDiv.className=`message ${message._sender.userId === sb.currentUser.userId ? 'user' : 'other'}`;const profileImg=document.createElement('img');profileImg.src=message._sender.profileUrl||userIcon;const messageContent=document.createElement('div');messageContent.className='message-content';const messageSender=document.createElement('div');messageSender.className='message-sender';console.log('Sender:-------------',message);console.log('Sender:-------------',message._sender);messageSender.textContent=message._sender.nickname;const messageText=document.createElement('div');messageText.className='message-text';messageText.innerHTML=formattedMessage;messageContent.appendChild(profileImg);messageContent.appendChild(messageSender);messageDiv.appendChild(messageContent);messageDiv.appendChild(messageText);messagesContainer.appendChild(messageDiv)});messagesContainer.scrollTop=messagesContainer.scrollHeight}
function isJson(str){try{JSON.parse(str);return!0}catch(e){return!1}}
function submitForm(event){event.preventDefault();const email=document.getElementById('email').value;const phone=document.getElementById('phone').value;const username=document.getElementById('username').value;const userObject={email:email,phoneNumber:phone,username:username};document.getElementById('form-container').style.display='none';document.getElementById('chat-section').style.display='block';initiateChat(userObject,!0)}
document.getElementById("sendbird-widget").addEventListener("click",function(){const parentContainer=document.getElementById("sendbird-chat-container");const formContainer=document.getElementById("form-container");const chatContainer=document.getElementById("chat-section");if(parentContainer.style.display==="none"){parentContainer.style.display="block";if(chatContainer.style.display==="none"){formContainer.style.display="block"}else{formContainer.style.display="none"}}else{parentContainer.style.display="none"}});window.submitForm=submitForm}})()