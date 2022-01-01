
function showRegisterForm() {
  $('.division').fadeOut('fast');
  $('.social').fadeOut('fast');
  $('.loginBox').fadeOut('fast', function () {
    $('.registerBox').fadeIn('fast');
    $('.login-footer').fadeOut('fast', function () {
      $('.register-footer').fadeIn('fast');
    });
    $('.modal-title').html('Create an account');
  });
  $('.error').removeClass('alert alert-danger').html('');
}

function showLoginForm() {
  $('#loginModal .registerBox').fadeOut('fast', function () {
    $('.loginBox').fadeIn('fast');
    $('.division').fadeIn('fast');
    $('.social').fadeIn('fast');
    $('.register-footer').fadeOut('fast', function () {
      $('.login-footer').fadeIn('fast');
    });

    $('.modal-title').html('Sign in');
  });
  $('.error').removeClass('alert alert-danger').html('');
}

function openLoginModal() {
  setTimeout(function () {
    $('#loginModal').modal('show');
    showLoginForm();
  }, 230);
}

function openRegisterModal() {
  setTimeout(function () {
    $('#loginModal').modal('show'); //mặc định là đăng nhập
    showRegisterForm(); //đổi đăng nhập thành đăng ký
  }, 230);
}
