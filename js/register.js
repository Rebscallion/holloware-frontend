const registerBtn = document.getElementById("register-button");
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
const profileImgInput = document.getElementById("image-url-input");

const server = "http://holloware-backend-psi.vercel.app";

registerBtn.onclick = function () {
    event.preventDefault();
    let username = usernameInput.value;
    let password = passwordInput.value;
    let profileImg = profileImgInput.value;

    console.log(username, password, profileImg);

    $.ajax({
        url: `${server}/registerUser`,
        type: 'POST',
        data: {
            username: username,
            password: password,
            profile_img_url: profileImg
        },
        success: function (user) {
            if (user !== 'username already exists') {
                console.log("you have registered")
                console.log(user);

                $.ajax({
                    url: `${server}/loginUser`,
                    type: 'POST',
                    data: {
                        username: usernameInput.value,
                        password: passwordInput.value
                    },
                    success: function (user) {
                        if (user == 'user not found') {
                            console.log('User not found, please register');
                        } else if (user == 'not authorised') {
                            console.log('Incorrect password, try again');
                        } else {
                            console.log("logged in successfully as:");
                            console.log(user);
                            // set the local storage (cookie) properties equal to the retrieved user data
                            sessionStorage.setItem('userID', user._id);
                            sessionStorage.setItem('userName', user.username);
                            sessionStorage.setItem('profileImg', user.profile_img_url);
                            // redirect automatically
                            document.location.href = 'index.html';
                        }//end of if statement
                    },// end of inner success
                    error: function () {
                        console.log('error: cannot call api');
                        alert('Unable to login - unable to call api');
                    }// end of error
                })//end of inner post ajax
            } else {
                console.log('username taken already. Please try another name');
            }
        }, //end of outer success 
        error: function () {
            console.log('cannot call api')
        }// end of error
    }) //end of ajax
}// end of register btn onclick