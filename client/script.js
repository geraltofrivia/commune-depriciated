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
            $loginPage.slideUp(500);
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
         createUserCard(data.username)
         $('#'+data.username+' .user-name').html(data.username);
     });
     socket.on('user left',function (data) {
         console.log(data.username + 'left');
         $('#'+data.username).remove();
     });

     function createUserCard(id) {
        if ('content' in document.createElement('template')) {
            var template = document.querySelector('#user-Element').content;
            template.querySelector('.user-card').id=id;
            var clone = document.importNode(template, true);
            var users = document.querySelector('.users');
            console.log(clone)
            users.appendChild(clone);
        }
     }
 
     
     //User msg management
     socket.on('new message',function (data) {
         console.log(data.username + data.message);
         $('#'+data.username+' .message-box').html(data.message);
     });

     socket.on('login',function(data){
         console.log("usernameList"+data.usernames)
         var userList=data.usernames.split(",")
         for (var i=0;i<userList.length;i++) {
             createUserCard(userList[i]);
             $('#'+userList[i]+' .user-name').html(userList[i]);
         }
     });


     $inputMessage.keyup(function (event) {
         // Auto-focus the current input when a key is typed
         if (username) {
             var message = $inputMessage.val();
             console.log(message)
             if (event.which === 13 ) {
                $('#'+username +' .message-box').html(' ');
                $inputMessage.val(' ');
                console.log("time to clear the chat box");
                message = ' ';
             }
             $('#'+username +' .message-box').html(message)
             if (message && connected) {
                 socket.emit('new message', message);
             }
         } 
         if (event.which === 13 ) {
             $('#'+username +' .message-box').html(' ');
             $inputMessage.val(' ');
             console.log("time to clear the chat box")
         }   
     });

});

