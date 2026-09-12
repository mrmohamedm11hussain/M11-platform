// =====================================================
// لغتي لغة الضاد
// Real Supabase Login
// =====================================================

const userType = document.getElementById("userType");
const teacherPasswordField = document.getElementById("teacherPasswordField");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");


// إظهار كلمة مرور المعلمة
if (userType) {
  userType.addEventListener("change", function () {

    if (this.value === "teacher") {
      teacherPasswordField.style.display = "block";
    } else {
      teacherPasswordField.style.display = "none";
    }

  });
}


// إظهار / إخفاء كلمة المرور
function togglePassword() {

  const input = document.getElementById("teacherPassword");

  if (!input) return;

  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}


// رسالة الخطأ
function showError(message) {

  if (!loginMessage) return;

  loginMessage.textContent = message;
  loginMessage.style.display = "block";
}


// تسجيل الدخول
if (loginForm) {

  loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username =
      document.getElementById("username").value.trim();

    const type =
      document.getElementById("userType").value;


    if (!username) {

      showError("من فضلك اكتب اسم المستخدم.");

      return;
    }


    // =================================================
    // TEACHER LOGIN
    // =================================================

    if (type === "teacher") {

      const password =
        document.getElementById("teacherPassword").value;


      if (!password) {

        showError("من فضلك اكتب كلمة المرور.");

        return;
      }


      // اسم المستخدم الخاص بالمعلمة
      if (username !== "samar") {

        showError("اسم مستخدم المعلمة غير صحيح.");

        return;
      }


      // البريد الداخلي لحساب المعلمة
      const email = "samar@loghaty.local";


      const {
        data,
        error
      } = await supabaseClient.auth.signInWithPassword({

        email: email,

        password: password

      });


      if (error) {

        console.error(error);

        showError("بيانات تسجيل الدخول غير صحيحة.");

        return;
      }


      // حفظ البيانات محليًا للواجهة فقط
      localStorage.setItem(
        "userName",
        "المعلمة سمر رمضان"
      );

      localStorage.setItem(
        "userType",
        "teacher"
      );


      window.location.href = "teacher.html";

      return;
    }


    // =================================================
    // STUDENT LOGIN
    // =================================================

    showError(
      "تسجيل الطلاب سيتم تفعيله في الخطوة التالية."
    );

  });

}
