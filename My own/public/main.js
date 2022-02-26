const firebaseConfig = {
    apiKey: "AIzaSyD47SoY-tAmOmh5XYhJLIerZLDJR0zcwms",
    authDomain: "my-own-2f093.firebaseapp.com",
    projectId: "my-own-2f093",
    storageBucket: "my-own-2f093.appspot.com",
    messagingSenderId: "1035026129566",
    appId: "1:1035026129566:web:f4467f350bbbd22699d18f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


//jquery를 활용한 로그인 기능
$(document).ready(function ($) {
    firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(user)
        $("#profile").css("display","block")
        $("#profile_img").attr("src",user.photoURL)
        $("#profile.info").css("display","block")
        $("#profile_img").text(user.displayName)
        $("#logInButton").css("display","none")
        $("#logOutButton").css("display","block")

    }
    else{ 
        console.log('not login')
        $("#profile").css("display","none")
        $("#profile_img").attr("src","")
        $("#profile.info").css("display","none")
        $("#profile_img").text("")
        $("#logInButton").css("display","block")
        $("#logOutButton").css("display","none")
    }
    });
    });



function logOut(){
    firebase.auth().signOut().then(function () {
    }, function (error) {
    //DO
    });
}



function googleLogIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/plus.login");
    provider.setCustomParameters({
        prompt: "select_account"
    });

    firebase.auth().signInWithRedirect(provider).then(function (result) {
        firebase.auth()
            .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
            })
            .catch(function (error) {// Handle Errors here.
                var errorCode = error.code;
                // The email of the user's account used.
                var email = error.email;
            });
    });
}







