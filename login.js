document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("loginButton");
  const googleLoginBtn = document.getElementById("googleLoginBtn");

  /* =====================================================
     KEYBOARD ENTER KEY NAVIGATION
     ===================================================== */
  // Pressing Enter in Email moves focus to Password
  emailInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordInput.focus();
    }
  });

  // Pressing Enter in Password triggers Login action
  passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loginButton.click();
    }
  });

  /* =====================================================
     NORMAL EMAIL/PASSWORD LOGIN
     ===================================================== */
  loginButton.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Login error:", error);
        alert(error.message);
        loginButton.disabled = false;
        loginButton.textContent = "Login";
        return;
      }

      console.log("Login successful:", data);
      window.location.href = "index.html";
    } catch (err) {
      console.error("Unexpected login error:", err);
      alert("Login failed: " + err.message);
      loginButton.disabled = false;
      loginButton.textContent = "Login";
    }
  });

  /* =====================================================
     GOOGLE LOGIN
     ===================================================== */
  const googleBtnHtml = `
  <span class="google-icon">
        <svg viewBox="0 0 18 18" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.617z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.458 2.013.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
      </span>
      <span>Continue with Google</span>
    `;
    googleLoginBtn.addEventListener("click", async () => {
    googleLoginBtn.disabled = true;
    googleLoginBtn.textContent = "Opening Google...";
    try {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://math-solver-beta.vercel.app/index.html",
    },
  });

  if (error) {
    console.error("Google login error:", error);
    alert("Google login failed: " + error.message);
    googleLoginBtn.disabled = false;
    googleLoginBtn.innerHTML = googleBtnHtml;
  }
} catch (err) {
  console.error("Unexpected Google login error:", err);
  alert("Google login failed: " + err.message);
  googleLoginBtn.disabled = false;
  googleLoginBtn.innerHTML = googleBtnHtml;
}
});
});