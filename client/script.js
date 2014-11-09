 $(document).ready( function(){
     //Vars of DOM    
     var $window = $(window);    //Variable of whole window
     var $usernameInput = $('.usernameInput');       //Var for the user's name @ login
     var $users = $('.users');        //Var for the list of users's div
     var $inputMessage = $('.inputMessage');     //Var for the user's input
     var $loginPage = $('.login.page');       //Var for the whole login page
     var $chatPage = $('.chat.page');     //Var for the actual chat area

     //Vars for misc manipulation
     var username;
     var connected = false;
     var FADE_TIME = 150;
     var $currentInput = $usernameInput.focus();

     //Init the socket.io
     var socket = io();

     //Function used to typescaping the input
     function clean_input(input) {
         return text(input).text();
     }


    function setUsername() {
        username = $usernameInput.val().trim();
        if (username) {
            $loginPage.fadeOut();
            $chatPage.show();
            $loginPage.off('click');
            $currentInput = $inputMessage.focus();
            socket.emit('add user', username);
        }
    }

     $loginPage.keydown(function (event) {
         connected=true
         console.log('keydown')
         // Auto-focus the current input when a key is typed

         if (event.which === 13 && username==null) {
             // When the client hits ENTER on their keyboard
             setUsername();
         }
     });


     //User div management
     socket.on('user joined',function (data) {
         console.log(data.username + ' joined');
         append_command = "<user-card id='"+data.username+"' > <h2>"+data.username+"</h2> </user-card>";
         console.log(append_command)
         $users.append(append_command)
     });
     socket.on('user left',function (data) {
         console.log(data.username + 'left');
         $('#'+data.username).remove();
     });


     //User msg management
     socket.on('new message',function (data) {
         console.log(data.username + data.message);
         $('#'+data.username+'.message').html(data.message);
     });

     socket.on('login',function(data){
         console.log("usernameList"+data.usernames)
         var userList=data.usernames.split(",")
         for (var i=0;i<userList.length;i++)
         {
            append_command = "<user-card id='"+userList[i]+"'> <h2>"+userList[i]+"</h2> </user-card";
            console.log(append_command)
            $users.append(append_command)
         }
     });


     $inputMessage.keydown(function (event) {
         // Auto-focus the current input when a key is typed
         if (username) {
             var message = $inputMessage.val();
             $('#'+username).html(message)
             sendMessage(message);
             typing = false;
         } 
         if (event.which === 13 ) {
             // Use it to clear the text box later on 
             console.log("time to clear the chat box")
         }   
     });


     function sendMessage (message) {
         // if there is a non-empty message and a socket connection
         //console.log(message)
         console.log(connected)
         if (message && connected) {
             //$inputMessage.val('');
             // tell server to execute 'new message' and send along one parameter
             console.log(message);
             socket.emit('new message', message);
         }
     }
});

