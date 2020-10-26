const socket = io("/");
const videoPlayer = document.getElementById("videoPlayer");
const myPeer = new Peer(undefined, {
  host: "/",
  port: "3001"
});
const newVideo = document.createElement("video");
newVideo.muted = true;
const peers = {};

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  mulStream(newVideo, stream);

  myPeer.on("call", call => {
    call.answer(stream);
    const video = document.createElement("video");
    call.on("stream", vidStream => {
      mulStream(video, vidStream);
    });
  });

  socket.on("user-connected", userId => {
    addNewPerson(userId, stream);
  });
});
  socket.on("user-disconnected", userId => {
    if (peers[userId]) {
      peers[userId].close();
    }    
  });

myPeer.on("open", id => {
  socket.emit("joinRoom", ROOM_URL, id)
});

socket.emit("joinRoom", ROOM_URL)

function addNewPerson(userId, stream) {
  const x = myPeer.call(userId, stream);
  const video = document.createElement("video");
  x.on("stream", vidStream => {
    mulStream(video, vidStream);
  });
  x.on("close", () => {
    video.remove();
  });
  peers[userId] = x;
}


function mulStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoPlayer.append(video);
    
  
  
}
