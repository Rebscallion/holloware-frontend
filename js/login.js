
const loginBtn = document.getElementById("login-button");
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");

const server = "http://holloware-backend-psi.vercel.app";

loginBtn.onclick = () => {
    $.ajax({
        url: `${server}/loginUser`,
        type: 'POST',
        data: {
            username: usernameInput.value,
            password: passwordInput.value
        },

        success: (user) => {
            if (user == 'user not found') {
                console.log("user is not found please register");
                alert("Username not found. please register or try again.");
            } else if (user == 'not authorised') {
                console.log('Incorrect password, try again');
                alert("Incorrect password. Please try again.");
            } else {
                console.log("awesome you are logged in successfully")
                console.log(user);

                sessionStorage.setItem('userID', user._id);
                sessionStorage.setItem('userName', user.username);
                sessionStorage.setItem('profileImg', user.profile_img_url);
                // redirect automatically
                document.location.href = 'index.html';
            }// end of if statement 
        }, //end of success 
        error: () => {
            console.log("error cannot call api");

        }
    })// end of ajax
}// end of login onclick function 
