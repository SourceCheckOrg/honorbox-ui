import io from 'socket.io-client';

let socketClient;

const initiate = (url) => {
  if (socketClient) return; 
  socketClient = io(url);
}

const disconnect = () => {
   if(socketClient) socketClient.disconnect();
}

const on = (key, cb) => {
  if (!socketClient) return(true);
  socketClient.on(key, msg => {
    return cb(msg);
  });
}

const emit = (key, obj) => {
  if (socketClient) socketClient.emit(key, obj);
}

export default {
  initiate, 
  emit,
  on,
  disconnect
}
