const express = require('express');
const app = express();
const bodyParser=require('body-parser');
const nodemailer = require('nodemailer');
app.use(bodyParser.json());
var firebase = require('firebase');
var validator = require("email-validator");
// const bcrypt = require('bcrypt');
const crypto = require('crypto');
// const saltRounds = 10;

var config = {
   apiKey: "AIzaSyD_BZoGyedQ_MEeOUq4rWJ6MbRPpLveb9E",
   authDomain: "reactnative-e1c19.firebaseapp.com",
   databaseURL: "https://reactnative-e1c19.firebaseio.com",
   projectId: "reactnative-e1c19",
   storageBucket: "reactnative-e1c19.appspot.com",
   messagingSenderId: "108896196107",
   appId: "1:108896196107:web:bbe8f210a885d8f7"
 };


const port = 8080;
firebase.initializeApp(config);
var ip = '0.0.0.0';

app.listen(port,ip, () => console.log(`App listening on port ${port}!`));

//---------------functions----------------------------------------------------------
function encrypt(data, pass) {
  var cipher = crypto.createCipher('aes-256-ecb', pass);
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
};

function conversion(date){
  for(var i = 0; i < date.length; i++){
    if(date[i] == '/'){
      date = date.substr(0 , i) + '-' + date.substr(i + 1);
    }
  };
  return date;
};

function paytmconversion(date){
  for(var i = 0; i < date.length; i++){
    if(date[i] == '@'){
      date = date.substr(i + 1);
      break;
    }
  };
  return date;
};




function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


//----------------get- Requests-----------------------------------------------------------

app.get("/verifymail",function(req,res){

  data={
    email : req.query.id3,
    password : req.query.id1,
    phoneno : req.query.id4 ,
    contibution : 0
  }

  let paas = (encrypt(data.password, "donate")).toString() ; 
  // req.query.id1 = encrypt(req.query.id, "donate").toString();
  if(req.query.id2==paas){

    var uid = makeid(16);
    var date = new Date(Date.now()).toLocaleString();
    date = conversion(date);
    uid = date + uid;
    
    firebase.database().ref('/Users').child(uid).set(data);
    res.send("Verfication Successful");
	return;
  }
  else {
    res.send("Verfication Unsuccessful");
	return;
  }
});
app.get("/verifypassword",function(req,res){

  data={
    email : req.query.id3,
    password : req.query.id1, 
  }

  let paas = (encrypt(data.password, "donate")).toString() ; 
  // req.query.id1 = encrypt(req.query.id, "donate").toString();
  if(req.query.id2==paas){
    var projectsRef = firebase.database().ref('/Users').orderByChild('timestamp');
    projectsRef.once('value', (snapshot) => {
    let objKey = Object.keys(snapshot.val());
    let projects = [];
    for(var i =0 ;i < objKey.length; i++ ){
      if(snapshot.val()[objKey[i]].email==data.email){
        // console.log(snapshot.val()[objKey[i]].email);
        firebase.database().ref('/Users/'+objKey[i]).update({
          password : data.password
        });
        res.send("Verfication Successful");
        return;
      }
    }
    res.send("Verfication Unsuccessful");
    return;

    });
  }
});
app.get("/projects", function(req, res){
  if(req.query.search != null){
    console.log(req.query.search);
  }
  var projectsRef = firebase.database().ref('/Projects').orderByChild('timestamp');
  projectsRef.once('value', (snapshot) => {
    let objKey = Object.keys(snapshot.val());
    let projects = [];
    for(var i =0 ;i < objKey.length; i++ ){
      if(snapshot.val()[objKey[i]].status=="YES"){
        // console.log(snapshot.val()[objKey[i]]);
        projects.push({refID:objKey[i], ...snapshot.val()[objKey[i]]});
      }
    };
    
      res.send(projects);
  });
  
})

app.get("/ownprojects", function(req, res){
  // if(req.query.email != null){
  //   console.log(req.query.email);
  // } 
  var projectsRef = firebase.database().ref('/Projects').orderByChild('timestamp');
  projectsRef.once('value', (snapshot) => {
    let objKey = Object.keys(snapshot.val());
    let projects = [];
    for(var i =0 ;i < objKey.length; i++ ){
      if(snapshot.val()[objKey[i]].email==req.query.email){
        // console.log(snapshot.val()[objKey[i]]);
        projects.push({refID:objKey[i], ...snapshot.val()[objKey[i]]});
      }
    };
    
      res.send(projects);
  });
  
})
app.get("/adminprojects", function(req, res){
  // if(req.query.email != null){
  //   console.log(req.query.email);
  // } 
  var projectsRef = firebase.database().ref('/Projects').orderByChild('timestamp');
  projectsRef.once('value', (snapshot) => {
    let objKey = Object.keys(snapshot.val());
    let projects = [];
    for(var i =0 ;i < objKey.length; i++ ){
      if(snapshot.val()[objKey[i]].status=="NO"&&snapshot.val()[objKey[i]].projectstatus=="Pending"){
        // console.log(snapshot.val()[objKey[i]]);
        projects.push({refID:objKey[i], ...snapshot.val()[objKey[i]]});
      }
    };
    
      res.send(projects);
  });
  
})

app.get("/adminprojectsformoney", function(req, res){
  // if(req.query.email != null){
  //   console.log(req.query.email);
  // } 
  var projectsRef = firebase.database().ref('/Projects').orderByChild('timestamp');
  projectsRef.once('value', (snapshot) => {
    let objKey = Object.keys(snapshot.val());
    let projects = [];
    for(var i =0 ;i < objKey.length; i++ ){
      if(snapshot.val()[objKey[i]].status=="YES"&&snapshot.val()[objKey[i]].requestedbalance!=0){
        // console.log(snapshot.val()[objKey[i]]);
        projects.push({refID:objKey[i], ...snapshot.val()[objKey[i]]});
      }
    };
    
      res.send(projects);
  });
  
})
app.get("/updateprojects", function(req, res){
  // if(req.query.email != null){
    // console.log('req.query.email');
  // } 

  var projectsRef = firebase.database().ref('/Projects').orderByChild('timestamp');
  projectsRef.once('value', (snapshot) => {
    let objKey = Object.keys(snapshot.val());
    for(var i =0 ;i < objKey.length; i++ ){
      if(objKey[i]==req.query.id){
        firebase.database().ref('/Projects/'+req.query.id).update({
          status : "YES",
          projectstatus : "Accepted"
        });
      }
    };
      res.end();
  });
  
})

app.post("/paytmresult", function(req, res){
  let refId = paytmconversion(req.body.body.ORDERID);

  let ttotal =  parseInt(req.body.body.TXNAMOUNT);
  let projectsRef = firebase.database().ref('/Projects').orderByChild('timestamp')
  let total = 0;
  projectsRef.once('value', (snapshot) => {
  total = ttotal+snapshot.val()[refId].projectbalance;
      // console.log(snapshot.val()[refId].projectbalance);
  }).then(()=>{
    firebase.database().ref('/Projects/'+refId).update({
      projectbalance : total,
    });
    res.end();
  });
  })
  
  

app.get("/updatedenyprojects", function(req, res){
  // if(req.query.email != null){
    // console.log('req.query.email');
  // } 

  var projectsRef = firebase.database().ref('/Projects').orderByChild('timestamp');
  projectsRef.once('value', (snapshot) => {
    let objKey = Object.keys(snapshot.val());
    for(var i =0 ;i < objKey.length; i++ ){
      if(objKey[i]==req.query.id){
        firebase.database().ref('/Projects/'+req.query.id).update({
          status : "NO",
          projectstatus : "Denied"
        });
      }
    };
      res.end();
  });
  
})

app.get("/verifybalance", function(req, res){
  // if(req.query.email != null){
    // console.log('req.query.email');
  // } 

  var projectsRef = firebase.database().ref('/Projects').orderByChild('timestamp');
  projectsRef.once('value', (snapshot) => {
    let objKey = Object.keys(snapshot.val());
    for(var i =0 ;i < objKey.length; i++ ){
      if(objKey[i]==req.query.id){
        let reqmoney =snapshot.val()[objKey[i]].requestedbalance;
   
        let withdrawnmoney = snapshot.val()[objKey[i]].projectwithdrawn;
        withdrawnmoney = parseInt(withdrawnmoney) + parseInt(reqmoney);
        let currentmoney = snapshot.val()[objKey[i]].projectbalance;
        currentmoney = parseInt(currentmoney) - parseInt(withdrawnmoney);
        firebase.database().ref('/Projects/'+req.query.id).update({
          projectwithdrawn : withdrawnmoney,
          requestedbalance : 0 ,
          currentbalance : currentmoney,
          moneystatus : "Accepted"
        });
      }
    };
      res.end();
  });
  
})

app.get("/ignorebalance", function(req, res){
  var projectsRef = firebase.database().ref('/Projects').orderByChild('timestamp');
  projectsRef.once('value', (snapshot) => {
    let objKey = Object.keys(snapshot.val());
    for(var i =0 ;i < objKey.length; i++ ){
      if(objKey[i]==req.query.id){
        firebase.database().ref('/Projects/'+req.query.id).update({
          requestedbalance : 0 ,
          moneystatus : 'Denied'
          });
      }
    };
      res.end();
  });
  
})


app.get("/requestMoney", function(req, res){
  // console.log(req.query);
  var projectsRef = firebase.database().ref('/Projects').orderByChild('timestamp');
  projectsRef.once('value', (snapshot) => {
    let objKey = Object.keys(snapshot.val());
    for(var i =0 ;i < objKey.length; i++ ){
      if(objKey[i]==req.query.id){
        firebase.database().ref('/Projects/'+req.query.id).update({
          requestedbalance : req.query.id2 ,
          requestedmsg : req.query.id3 ,
          moneystatus : "Pending"
        });
      }
    };
      res.end();
  });
  
})
// -----------------POST requests----------------------------------------------------
//login request----------------
app.post('/login',function(req,res){
  let data = {
    email : req.body.email,
    password : req.body.password 
  }
  data.password = encrypt(data.password, "donate").toString();
  
  database= firebase.database();
  var ref = database.ref("Users");
  ref.on("value", gotData, errData); 
  function gotData(ddata) {
    let users = ddata.val();
    let keys = Object.keys(users);
    for(var i=0; i<keys.length; i++){
      if(users[keys[i]].email == req.body.email && users[keys[i]].password == data.password ){
        if(users[keys[i]].email=="admin@donate.com"){
          res.send({val:"admin"});
          return; 
        }
        else 
          {res.send({val:"user"});
          return;
        };
      };
    }
    res.send({val:"nouser"});
    return;
  };

  function errData(err) {
    res.send(err);
    return;
  };
});
//forget password----------------
app.post('/forgetpassword',function(req,res){
  let data = {
    email : req.body.email,
    password : req.body.password
  }
  data.password = encrypt(data.password, "donate").toString();
  eemail = encrypt(data.password, "donate").toString();  
  database= firebase.database();
  var ref = database.ref("Users");
  ref.on("value", gotData, errData); 
  function gotData(ddata) {
    let users = ddata.val();
    let keys = Object.keys(users);
    for(var i=0; i<keys.length; i++){
    if(users[keys[i]].email == req.body.email){
      link="http://"+req.get('host')+"/verifypassword?id1="+data.password+"&id2="+eemail+"&id3="+data.email;
      const output = `
      <p>You made a sign up request on ${new Date(Date.now()).toLocaleString()}</p>
      <p>Please Click the link to verify the email </p>
      <a href="${link}">Click here to verify</a>
      <p>**This is an automatically generated mail. Please do not reply. For any further queries contact Donate App core team</p>
      `;
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
      
        auth: {
          user: 'donateappreact@gmail.com',
          pass: 'reactapp1234'
        },
        tls:{
          rejectUnauthorized:false
        }
      });
    
      let mailOptions = {
          from: '"DonateApp" <donateappreact@gmail.com>', 
          to: data.email ,//  list of receivers
          subject: 'Change Password',
          html: output
      };
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
      });

      res.send({val :"emailsent"});
      return;
    }
  
        }
        res.send({val :"emailsentfailure"});
      return;
    };


  function errData(err) {
    res.send(err);
    return;
  };
});
//signup requests-----

app.post('/addProject',function(req,res){
  var data=req.body;
 firebase.database().ref('/Projects').push(data);
  res.send(data);
});

app.post('/users',function(req,res){
    let data = req.body;

   if(req.body.email==''||req.body.password==''||req.body.phoneno==''||validator.validate(req.body.email)===false){
    res.send({ val :"dataincomplete"});
    return;
   }
   var exist =0;
   database= firebase.database();
   var ref = database.ref("Users");
   ref.on("value", gotData, errData);  
 
    function gotData(ddata) {
      let users = ddata.val();
      let keys = Object.keys(users);
      for(var i=0; i<keys.length; i++){
         // console.log(req.body.email);
        if(users[keys[i]].email == req.body.email){
          exist = 1;
          return;
        }
      };
     exist = 0; 
     return;
    } 
    function errData(err) {
      res.send(err);
      return ;
    }; 

    data.password = (encrypt(req.body.password, "donate")).toString();
    eemail = encrypt(data.password, "donate").toString();

    if(exist==0)
    {
      link="http://"+req.get('host')+"/verifymail?id1="+data.password+"&id2="+eemail+"&id3="+data.email+"&id4="+data.phoneno;
      const output = `
      <p>You made a sign up request on ${new Date(Date.now()).toLocaleString()}</p>
      <p>Please Click the link to verify the email </p>
      <a href="${link}">Click here to verify</a>
      <p>**This is an automatically generated mail. Please do not reply. For any further queries contact Donate App core team</p>
      `;
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
      
        auth: {
          user: 'donateappreact@gmail.com',
          pass: 'reactapp1234'
        },
        tls:{
          rejectUnauthorized:false
        }
      });
    
      let mailOptions = {
          from: '"DonateApp" <donateappreact@gmail.com>', 
          to: data.email ,//  list of receivers
          subject: 'Confirmation For Mail',
          html: output
      };
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
      });

      res.send({val :"emailsent"});
      return;
    }else {
      res.send({ val :"alreadyemail"});
    }
  // })
});

