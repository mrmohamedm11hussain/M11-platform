// لغتي لغة الضاد
// نظام إدارة المنصة

console.log("M11 Platform Started");


// حفظ بيانات بسيطة للطالب

function saveStudent(){

let name = document.getElementById("studentName").value;

if(name){

localStorage.setItem("studentName", name);

alert("تم حفظ بيانات الطالب");

}

}



// عرض اسم الطالب

function loadStudent(){

let name = localStorage.getItem("studentName");

let place = document.getElementById("studentDisplay");

if(name && place){

place.innerHTML = "أهلاً بك يا " + name;

}

}



// تسجيل زيارة درس

function completeLesson(){

let count = localStorage.getItem("lessonsDone") || 0;

count++;

localStorage.setItem("lessonsDone", count);

alert("تم تسجيل إكمال الدرس ✅");

}
