// =====================================================
// لغتي لغة الضاد - Supabase Connection
// M11 Platform - 2026
// =====================================================

const SUPABASE_URL = "https://uakzguayegoehrubxgdk.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_qtQHyBj7-fAX7U0bXRMayQ_mxe7hAxV";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);


// =====================================================
// GET CURRENT USER
// =====================================================

async function getCurrentUser() {
  const {
    data: { user },
    error
  } = await supabaseClient.auth.getUser();

  if (error) {
    console.error("Auth Error:", error);
    return null;
  }

  return user;
}


// =====================================================
// GET CURRENT PROFILE
// =====================================================

async function getMyProfile() {

  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Profile Error:", error);
    return null;
  }

  return data;
}


// =====================================================
// GET LESSONS
// =====================================================

async function getLessons() {

  const { data, error } = await supabaseClient
    .from("lessons")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (error) {
    console.error("Lessons Error:", error);
    return [];
  }

  return data || [];
}


// =====================================================
// GET LESSON BY ID
// =====================================================

async function getLesson(lessonId) {

  const { data, error } = await supabaseClient
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (error) {
    console.error("Lesson Error:", error);
    return null;
  }

  return data;
}


// =====================================================
// ADD LESSON - TEACHER
// =====================================================

async function addLesson({
  title,
  subject,
  grade,
  description = "",
  content = "",
  video_url = "",
  pdf_url = "",
  is_published = false
}) {

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("يجب تسجيل الدخول أولاً.");
  }

  const profile = await getMyProfile();

  if (!profile || profile.role !== "teacher") {
    throw new Error("ليس لديك صلاحية إضافة الدروس.");
  }

  const { data, error } = await supabaseClient
    .from("lessons")
    .insert([
      {
        title,
        subject,
        grade,
        description,
        content,
        video_url,
        pdf_url,
        is_published,
        teacher_id: user.id
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Add Lesson Error:", error);
    throw error;
  }

  return data;
}


// =====================================================
// UPDATE LESSON
// =====================================================

async function updateLesson(lessonId, updates) {

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("يجب تسجيل الدخول أولاً.");
  }

  const { data, error } = await supabaseClient
    .from("lessons")
    .update(updates)
    .eq("id", lessonId)
    .eq("teacher_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Update Lesson Error:", error);
    throw error;
  }

  return data;
}


// =====================================================
// DELETE LESSON
// =====================================================

async function deleteLesson(lessonId) {

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("يجب تسجيل الدخول أولاً.");
  }

  const { error } = await supabaseClient
    .from("lessons")
    .delete()
    .eq("id", lessonId)
    .eq("teacher_id", user.id);

  if (error) {
    console.error("Delete Lesson Error:", error);
    throw error;
  }

  return true;
}


// =====================================================
// SAVE STUDENT PROGRESS
// =====================================================

async function saveLessonProgress(
  lessonId,
  progress,
  completed = false
) {

  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  const { error } = await supabaseClient
    .from("lesson_progress")
    .upsert(
      {
        student_id: user.id,
        lesson_id: lessonId,
        progress: Math.max(0, Math.min(100, progress)),
        completed,
        completed_at: completed
          ? new Date().toISOString()
          : null
      },
      {
        onConflict: "student_id,lesson_id"
      }
    );

  if (error) {
    console.error("Progress Error:", error);
    return false;
  }

  return true;
}


// =====================================================
// GET MY PROGRESS
// =====================================================

async function getMyProgress() {

  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from("lesson_progress")
    .select("*")
    .eq("student_id", user.id)
    .order("updated_at", {
      ascending: false
    });

  if (error) {
    console.error("Progress Error:", error);
    return [];
  }

  return data || [];
}


// =====================================================
// SAVE QUIZ RESULT
// =====================================================

async function saveQuizResult(
  quizId,
  score,
  totalPoints,
  percentage
) {

  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  const { error } = await supabaseClient
    .from("quiz_attempts")
    .insert([
      {
        quiz_id: quizId,
        student_id: user.id,
        score,
        total_points: totalPoints,
        percentage
      }
    ]);

  if (error) {
    console.error("Quiz Result Error:", error);
    return false;
  }

  return true;
}


// =====================================================
// GET MY QUIZ RESULTS
// =====================================================

async function getMyQuizResults() {

  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from("quiz_attempts")
    .select("*")
    .eq("student_id", user.id)
    .order("submitted_at", {
      ascending: false
    });

  if (error) {
    console.error("Quiz Results Error:", error);
    return [];
  }

  return data || [];
}


// =====================================================
// LOGOUT
// =====================================================

async function logout() {

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error("Logout Error:", error);
  }

  localStorage.clear();

  window.location.href = "login.html";
}


// =====================================================
// AUTH STATE
// =====================================================

supabaseClient.auth.onAuthStateChange(
  (event, session) => {

    console.log(
      "Supabase Auth:",
      event,
      session ? "Logged in" : "Logged out"
    );

  }
);


// =====================================================
// START
// =====================================================

console.log("لغتي لغة الضاد - Supabase Connected ✅");
