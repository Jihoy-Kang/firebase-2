const firebaseConfig = {
    apiKey: "AIzaSyC8o0vL7tSuaTEAuna4nY0wttI6zJqYg68",
    authDomain: "test1-f1a97.firebaseapp.com",
    projectId: "test1-f1a97",
    storageBucket: "test1-f1a97.appspot.com",
    messagingSenderId: "732213978306",
    appId: "1:732213978306:web:2f93bad8f8fafe6565475b",
    measurementId: "G-NDBZN2QXBX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
let db = firebase.firestore();

$(document).ready(function ($) {
    onLoadData()
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



function onAddRecord() {
    var _email = $("#exampleInputEmail1").val();
    var _name = $("#exampleInputName").val();
    var _date = new Date();



    db.collection("bbs").add({
        name: _name,
        email: _email,
        eventtime: _date
    })
        .then((docRef) => {

            var _str = "<tr>";
            _str += "<td>" + _email + "</td>";
            _str += "<td>" + _name + "</td>";
            _str += "<td>" + _date + "</td></tr>";
            $("#tblData").append(_str)

            $("#exampleInputEmail1").val("");
            $("#exampleInputName").val("");


            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

var _allBbs = [];

function onLoadData() {
    $("#tblData").empty();
    db.collection("bbs")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var _t = {
                    id: doc.id,
                    value: doc.data()
                }
                _allBbs.push(_t);
                var _str = '<tr onclick="onSelectData(\'' + doc.id + '\')">';
                _str += "<td>" + doc.data().email + "</td>";
                _str += "<td>" + doc.data().name + "</td>";
                _str += "<td>" + getCurrentTime(
                    new Date(doc.data().eventtime.seconds * 1000)
                    ) + "</td></tr>";
                $("#tblData").append(_str);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        })
}


function onSelectData(id) {
    console.log(id);
    var _item = _allBbs.find(item => item.id == id); // find 배열함수
    console.log(_item)
    if (_item) {
        $("#btnUpdate").attr("data-rec-id", id);
        $("#btnDelete").attr("data-rec-id", id);
        $("#exampleInputEmail1").val(_item.value.email);
        $("#exampleInputName").val(_item.value.name);
    }
    else {
        $("#btnUpdate").attr("data-rec-id", '')
        $("#btnDelete").attr("data-rec-id", '');
    }
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

function onDeleteRecord(){
    var user = firebase.auth().currentUser;

    if(user){
        var _id = $("#btnDelete").attr("data-rec-id");
            db.collection("bbs").doc(_id).delete().then(() => {
                $("#exampleInputEmail1").val('');
                $("#exampleInputName").val('');
            console.log("Document successfully deleted!");
            onLoadData();
            }).catch((error) => {
            console.error("Error removing document: ", error);
            });
    }else{
        alert("Not Login")
    }
}

function onUpdateRecord(){
    var _email = $("#exampleInputEmail1").val();
    var _name = $("#exampleInputName").val();
    var _date = new Date();
    var db = firebase.firestore();

    var _id = $("#btnUpdate").attr("data-rec-id");
    var mRef = db.collection('bbs').doc(_id);
    mRef
    .update({
        name: _name,
        email: _email,
        eventtime: new Date(),
    
    })
    .then(function() {
        onLoadData();
    });
}


function getCurrentTime(val) {
    var t = "";
    var t1 = new Date(val);
    var yyyy = t1.getFullYear().toString();
    var mm = (t1.getMonth() + 1).toString();
    var dd = t1.getDate().toString();
    var hh = t1.getHours() < 10 ? "0" + t1.getHours() : t1.getHours();
    var min = t1.getMinutes() < 10 ? "0" + t1.getMinutes() : t1.getMinutes();
    var ss = t1.getSeconds() < 10 ? "0" + t1.getSeconds() : t1.getSeconds();
    t =
        yyyy +
        "/" +
        (mm[1] ? mm : "0" + mm[0]) +
        "/" +
        (dd[1] ? dd : "0" + dd[0]) +
        " " +
        hh +
        ":" +
        min +
        ":" +
        ss;
    return t;
}


