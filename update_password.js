document.addEventListener("DOMContentLoaded", () => {
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const updateBtn = document.getElementById("updateBtn");

  // Enter key press in confirm field submits form
  confirmPasswordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateBtn.click();
    }
  });

  updateBtn.addEventListener("click", async () => {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!newPassword || !confirmPassword) {
      alert("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    updateBtn.disabled = true;
    updateBtn.textContent = "Updating...";

    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        alert("Error updating password: " + error.message);
        updateBtn.disabled = false;
        updateBtn.textContent = "Update Password";
        return;
      }

      alert("Password updated successfully! Redirecting to login...");
      window.location.href = "login.html";
    } catch (err) {
      alert("Failed to update password: " + err.message);
      updateBtn.disabled = false;
      updateBtn.textContent = "Update Password";
    }
  });
});