var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


// usernames which are currently connected to the chat
var usernames = [];
var numUsers = 0;
    
    
app.get('/', function(req, res){ 
    res.sendFile(__dirname+'/templates/index.html');
});
app.get('/templates/client.js',function(req, res) {
    res.sendFile(__dirname+'/templates/client.js');
});

io.on('connection',function(socket) {
    var addedUser = false;
    console.log('new user connected');
    
    //This handler will be called everytime a key is pressed
    socket.on('new message',function(msg) {
        console.log('from: ' +socket.username +'message: '+ msg);
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: msg
        });
    });
    
    //This handler is called when the client disconnects
    socket.on('disconnect', function() {
        //Somehow remove the user from the list
        console.log('a user disconnected');
        if (addedUser) {
            delete usernames[socket.username];
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
    
    
    socket.on('add user', function(username) {
        socket.username = username;
        usernames.push(username)
        console.log(username)
        usernames[username] = username;
        ++numUsers;
        addedUser = true;
        console.log("the list of user names are " + usernames)
        usernameString=usernames.join()
        console.log("username list"+usernameString)
        socket.emit('login', {
            
            
            usernames:usernameString
        });
            
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });
});

http.listen(3000, function(){
    console.log('Server listening at port %d',port);
});