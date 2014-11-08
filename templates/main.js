console.log("__Script init__");
$(document).ready( function(){
    //Vars of DOM    
    var $window = $(window);    //Variable of whole window
    var $usernameInput = $('.usernameInput');       //Var for the user's name @ login
    var $users = $('.users');        //Var for the list of users's div
    var $inputMessage = $('.inputMessage');     //Var for the user's input
    var $loginPage = $('.login');       //Var for the whole login page
    var $chatPage = $('.chatpage');     //Var for the actual chat area

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
    
    socket.on('user joined',function (data) {
        console.log(data.username + ' joined');+
        $users.append('<li> <div id="%s" class="userDiv" > user </div>', data.username)
    });
    
    $loginPage.keydown(function (event) {
        console.log('keydown')
        // Auto-focus the current input when a key is typed
        if (event.which === 13) {
            // When the client hits ENTER on their keyboard
            console.log("in key down event")
            if (username) {
                sendMessage();
                socket.emit('stop typing');
                typing = false;
            } 
            else {
                setUsername();
            }
        }
    });
    
});