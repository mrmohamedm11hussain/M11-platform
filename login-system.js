/*
   نظام تسجيل الدخول
   لغتي لغة الضاد
*/


const TEACHER_USERNAME = "samar";

const TEACHER_PASSWORD = "sr4887";


const userType =
document.getElementById("userType");

const teacherPasswordField =
document.getElementById("teacherPasswordField");

const loginForm =
document.getElementById("loginForm");

const loginMessage =
document.getElementById("loginMessage");


/* إظهار كلمة مرور المعلمة */

userType.addEventListener("change", function(){

if(this.value === "teacher"){

teacherPasswordField.style.display = "block";

}
else{

teacherPasswordField.style.display = "none";

}

});


/* إظهار / إخفاء كلمة المرور */

function togglePassword(){

const input =
document.getElementById("teacherPassword");

if(input.type === "password"){

input.type = "text";

}
else{

input.type = "password";

}

}


/* رسالة الخطأ */

function showError(message){

loginMessage.textContent = message;

loginMessage.style.display = "block";

}


/* تسجيل الدخول */

loginForm.addEventListener("submit", function(event){

event.preventDefault();


const username =
document.getElementById("username")
.value
.trim();


const type =
document.getElementById("userType")
.value;


if(!username){

showError("من فضلك اكتب اسم المستخدم.");

return;

}


/* =========================
   دخول المعلمة
========================= */

if(type === "teacher"){

const password =
document.getElementById("teacherPassword")
.value;


if(username !== TEACHER_USERNAME){

showError(
"اسم مستخدم المعلمة غير صحيح."
);

return;

}


if(password !== TEACHER_PASSWORD){

showError(
"كلمة مرور المعلمة غير صحيحة."
);

return;

}


/* إنشاء جلسة المعلمة */

localStorage.setItem(
"userName",
"المعلمة سمر رمضان"
);

localStorage.setItem(
"userType",
"teacher"
);

localStorage.setItem(
"teacherLoggedIn",
"true"
);


/* الانتقال للوحة المعلمة */

window.location.href =
"teacher.html";

return;

}


/* =========================
   دخول الطالب
========================= */

localStorage.setItem(
"userName",
username
);

localStorage.setItem(
"userType",
"student"
);

localStorage.setItem(
"studentLoggedIn",
"true"
);


window.location.href =
"student.html";

});
