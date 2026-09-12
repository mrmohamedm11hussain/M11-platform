// =====================================================
// لغتي لغة الضاد
// Supabase Authentication
// =====================================================

const userType =
  document.getElementById("userType");

const usernameInput =
  document.getElementById("username");

const passwordInput =
  document.getElementById("password");

const usernameLabel =
  document.getElementById("usernameLabel");

const teacherNote =
  document.getElementById("teacherNote");

const loginForm =
  document.getElementById("loginForm");

const loginMessage =
  document.getElementById("loginMessage");

const loginButton =
  document.getElementById("loginButton");


// =====================================================
// CHANGE ACCOUNT TYPE
// =====================================================

userType.addEventListener("change", function(){

  if(this.value === "teacher"){

    usernameLabel.textContent =
      "اسم المستخدم";

    usernameInput.placeholder =
      "مثال: samar";

    teacherNote.style.display =
      "block";

  }else{

    usernameLabel.textContent =
      "البريد الإلكتروني";

    usernameInput.placeholder =
      "أدخل بريدك الإلكتروني";

    teacherNote.style.display =
      "none";
  }

});


// =====================================================
// PASSWORD VISIBILITY
// =====================================================

function togglePassword(){

  if(passwordInput.type === "password"){

    passwordInput.type = "text";

  }else{

    passwordInput.type = "password";

  }

}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(text, success = false){

  loginMessage.textContent = text;

  loginMessage.style.display = "block";

  if(success){

    loginMessage.style.background = "#dcfce7";
    loginMessage.style.color = "#166534";

  }else{

    loginMessage.style.background = "#fee2e2";
    loginMessage.style.color = "#991b1b";

  }

}


// =====================================================
// LOGIN
// =====================================================

loginForm.addEventListener(
  "submit",
  async function(event){

    event.preventDefault();


    const identifier =
      usernameInput.value.trim();

    const password =
      passwordInput.value;


    if(!identifier){

      showMessage(
        "من فضلك أدخل بيانات الدخول."
      );

      return;

    }


    if(!password){

      showMessage(
        "من فضلك أدخل كلمة المرور."
      );

      return;

    }


    loginButton.disabled = true;

    loginButton.textContent =
      "⏳ جاري تسجيل الدخول...";


    try{


      // =================================================
      // TEACHER
      // =================================================

      if(userType.value === "teacher"){

        if(identifier !== "samar"){

          showMessage(
            "اسم مستخدم المعلمة غير صحيح."
          );

          return;
        }


        const email =
          "samar@loghaty.local";


        const { data, error } =
          await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

          });


        if(error){

          console.error(error);

          showMessage(
            "بيانات المعلمة غير صحيحة."
          );

          return;

        }


        const profile =
          await getMyProfile();


        if(!profile || profile.role !== "teacher"){

          await supabaseClient.auth.signOut();

          showMessage(
            "هذا الحساب ليس حساب معلمة."
          );

          return;

        }


        localStorage.setItem(
          "userName",
          "المعلمة سمر رمضان"
        );

        localStorage.setItem(
          "userType",
          "teacher"
        );


        window.location.href =
          "teacher.html";

        return;

      }


      // =================================================
      // STUDENT
      // =================================================

      const { data, error } =
        await supabaseClient.auth.signInWithPassword({

          email: identifier,

          password: password

        });


      if(error){

        console.error(error);

        showMessage(
          "البريد الإلكتروني أو كلمة المرور غير صحيحة."
        );

        return;

      }


      const profile =
        await getMyProfile();


      if(!profile){

        await supabaseClient.auth.signOut();

        showMessage(
          "لم يتم العثور على بيانات الطالب."
        );

        return;

      }


      if(profile.role !== "student"){

        await supabaseClient.auth.signOut();

        showMessage(
          "هذا الحساب ليس حساب طالب."
        );

        return;

      }


      localStorage.setItem(
        "userName",
        profile.full_name || "الطالب"
      );

      localStorage.setItem(
        "userType",
        "student"
      );


      window.location.href =
        "student.html";


    }catch(error){

      console.error(error);

      showMessage(
        "حدث خطأ غير متوقع. حاول مرة أخرى."
      );

    }finally{

      loginButton.disabled = false;

      loginButton.textContent =
        "تسجيل الدخول";

    }

  }
);
