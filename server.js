var app = require('express')();
var http = require('http').Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 5000;
app.get('/', function(req, res){
  // Send "Hello world" if accessing "/"
  res.sendFile(__dirname + '/client.html');
});

io.emit('some event', { for: 'everyone' });
io.on('connection', function(socket){
	//socket.broadcast.emit('broadcast','Hello all...');
	
	socket.on('join', function(name){
      socket.name = name;
      socket.broadcast.emit('chat message',name+' connected');
      console.log('user connected:' +name);
   }); 
	
  socket.on('chat message', function(msg){
	  console.log('message: ' + msg);
    //io.emit('chat message', msg);
	io.emit('chat message', socket.name + ':' +msg);
  });
  
  socket.on('disconnect', function(){
    if(socket.name !== undefined){
    console.log('user disconnected');
    socket.broadcast.emit('chat message', socket.name + ' has disconnected from the chat. ');
  }
  });
});
   

http.listen(port, function(){
  console.log('listening on *:'+port);
});
