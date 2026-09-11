function login(){

let name = document.getElementById("username").value;

let type = document.getElementById("userType").value;


if(name === ""){

alert("اكتب الاسم أولاً");
return;

}


localStorage.setItem("userName",name);
localStorage.setItem("userType",type);



if(type === "student"){

window.location.href="student.html";

}

else{

window.location.href="teacher.html";

}


}
