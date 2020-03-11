function openLogin() {
    $('#registerform').hide();
    $('#loginform').toggle()

}

function openRegister() {
    $('#loginform').hide();
    $('#registerform').toggle();
}


$(function(event) {
    
    $('#login-form').on('click', function() { openLogin() });
    $('#register-form').on('click', function() { openRegister() })

    if(!$(event.target).closest('#loginform').length || !$(event.target).closest('#registerform').length) {
        $('#registerform').hide();
        $('#loginform').hide();

    }
})