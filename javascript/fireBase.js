// var app_fireBase = {};
(function(){

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA9o1v8uwzW5cwL2Vo2HjUtUWZj59GvjwY",
    authDomain: "moviemate-8f88c.firebaseapp.com",
    databaseURL: "https://moviemate-8f88c.firebaseio.com",
    projectId: "moviemate-8f88c",
    storageBucket: "gs://moviemate-8f88c.appspot.com ",
    messagingSenderId: "320634779607"
  };
  firebase.initializeApp(config);




  btnLogin.addEventListener('click', e => {
    firebase.auth().signInAnonymously();
  });
 
  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    console.log(firebaseUser);
  });
  


  
}());
  
// app_fireBase = firebase;




  

