(function () {

  // ============================================================
  // PROTECTED PAGES
  // ============================================================

  const protectedPages = [
    "operation.html",
    "operations.html"
  ];

  const currentPath = window.location.pathname;

  const isProtectedPage = protectedPages.some((page) =>
    currentPath.endsWith(page)
  );


  // ============================================================
  // PREVENT FLASH BEFORE AUTH CHECK
  // ============================================================

  // Protected pages start hidden.
  // If the user is authenticated, the page will be revealed.
  // If not authenticated, the page will be revealed only together
  // with the locked overlay.
  
  if (isProtectedPage) {
    document.documentElement.style.visibility = "hidden";
  }


  // ============================================================
  // AUTH GUARD STYLES
  // ============================================================

  const style = document.createElement("style");

  style.textContent = `
    #authGuardOverlay {
      position: fixed;
      inset: 0;
      z-index: 999999;

      display: flex;
      justify-content: center;
      align-items: center;

      background: rgba(0, 0, 0, 0.78);

      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);

      font-family: 'Montserrat', sans-serif;
    }

    .auth-guard-box {
      width: 370px;
      max-width: 90%;

      padding: 35px 30px;

      text-align: center;

      border-radius: 22px;

      background: rgba(15, 15, 25, 0.96);

      border: 1px solid rgba(0, 242, 255, 0.4);

      box-shadow:
        0 0 25px rgba(0, 242, 255, 0.3),
        0 0 50px rgba(255, 0, 212, 0.15);

      animation: authGuardAppear 0.35s ease;
    }

    .auth-guard-icon {
      font-size: 45px;
      margin-bottom: 15px;
    }

    .auth-guard-box h2 {
      margin: 0 0 12px;

      color: #00f2ff;

      font-size: 25px;
    }

    .auth-guard-box p {
      margin: 0 0 25px;

      color: rgba(255, 255, 255, 0.75);

      font-size: 14px;

      line-height: 1.6;
    }

    .auth-guard-button {
      width: 100%;

      padding: 12px;

      margin-top: 10px;

      border: none;

      border-radius: 25px;

      font-family: 'Montserrat', sans-serif;

      font-size: 14px;

      font-weight: 600;

      cursor: pointer;

      color: white;

      background:
        linear-gradient(
          90deg,
          #00f2ff,
          #7a2cff,
          #ff00d4
        );

      transition: 0.3s;
    }

    .auth-guard-button:hover {
      transform: translateY(-2px);

      box-shadow:
        0 0 15px rgba(0, 242, 255, 0.5);
    }

    .auth-guard-close {
      background: rgba(255, 255, 255, 0.12);

      border: 1px solid rgba(255, 255, 255, 0.25);
    }

    .auth-guard-close:hover {
      background: rgba(255, 255, 255, 0.2);

      box-shadow: none;
    }

    @keyframes authGuardAppear {

      from {
        opacity: 0;

        transform:
          scale(0.92)
          translateY(15px);
      }

      to {
        opacity: 1;

        transform:
          scale(1)
          translateY(0);
      }

    }

    @media (max-width: 500px) {

      .auth-guard-box {
        padding: 30px 22px;
      }

      .auth-guard-box h2 {
        font-size: 22px;
      }

    }
  `;

  document.head.appendChild(style);


  // ============================================================
  // SHOW AUTH GUARD
  // ============================================================

  window.showAuthGuardModal = function () {

    document.body.style.overflow = "hidden";

    let overlay =
      document.getElementById("authGuardOverlay");


    // ------------------------------------------------------------
    // CREATE OVERLAY
    // ------------------------------------------------------------

    if (!overlay) {

      overlay = document.createElement("div");

      overlay.id = "authGuardOverlay";

      overlay.innerHTML = `
        <div class="auth-guard-box">

          <div class="auth-guard-icon">
            🔒
          </div>

          <h2>
            Content Locked
          </h2>

          <p>
            Please log in or create an account
            to use this feature.
          </p>

          <button
            type="button"
            class="auth-guard-button"
            id="authGuardLogin"
          >
            Log In
          </button>

          <button
            type="button"
            class="auth-guard-button"
            id="authGuardSignup"
          >
            Create Account
          </button>

          <button
            type="button"
            class="auth-guard-button auth-guard-close"
            id="authGuardClose"
          >
            Close
          </button>

        </div>
      `;

      document.body.appendChild(overlay);


      // ----------------------------------------------------------
      // LOGIN BUTTON
      // ----------------------------------------------------------

      document
        .getElementById("authGuardLogin")
        .addEventListener("click", function () {

          window.location.replace("login.html");

        });


      // ----------------------------------------------------------
      // SIGNUP BUTTON
      // ----------------------------------------------------------

      document
        .getElementById("authGuardSignup")
        .addEventListener("click", function () {

          window.location.replace("signup.html");

        });


      // ----------------------------------------------------------
      // CLOSE BUTTON
      // ----------------------------------------------------------

      document
        .getElementById("authGuardClose")
        .addEventListener("click", function () {

          window.closeAuthGuardModal();

        });

    }


    // ------------------------------------------------------------
    // IMPORTANT:
    // Reveal the protected page ONLY together with the overlay.
    //
    // This allows the backdrop-filter to blur the page exactly
    // like your screenshot.
    // ------------------------------------------------------------

    if (isProtectedPage) {

      document.documentElement.style.visibility =
        "visible";

    }


    overlay.style.display = "flex";

  };


  // ============================================================
  // CLOSE AUTH GUARD
  // ============================================================

  window.closeAuthGuardModal = function () {

    // ------------------------------------------------------------
    // PROTECTED PAGE
    // ------------------------------------------------------------
    //
    // NEVER hide the overlay first.
    //
    // Immediately leave the protected page.
    // Therefore operation.html / operations.html cannot
    // become visible after pressing Close.
    //

    if (isProtectedPage) {

      window.location.replace("index.html");

      return;
    }


    // ------------------------------------------------------------
    // NORMAL PAGE
    // ------------------------------------------------------------

    const overlay =
      document.getElementById("authGuardOverlay");

    if (overlay) {

      overlay.style.display = "none";

    }

    document.body.style.overflow = "";

  };


  // ============================================================
  // AUTHENTICATION CHECK
  // ============================================================

  async function checkAuthentication() {

    // Normal pages don't need protection.
    if (!isProtectedPage) {
      return;
    }


    try {

      // ----------------------------------------------------------
      // CHECK SUPABASE
      // ----------------------------------------------------------

      if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
      ) {

        window.showAuthGuardModal();

        return;
      }


      // ----------------------------------------------------------
      // GET CURRENT SESSION
      // ----------------------------------------------------------

      const {
        data,
        error
      } = await supabaseClient.auth.getSession();


      // ----------------------------------------------------------
      // NOT LOGGED IN
      // ----------------------------------------------------------

      if (
        error ||
        !data ||
        !data.session
      ) {

        // This will:
        //
        // 1. Reveal the protected page
        // 2. Immediately put the locked overlay over it
        // 3. Blur the page behind it
        //
        // Result = same appearance as your screenshot.

        window.showAuthGuardModal();

        return;
      }


      // ----------------------------------------------------------
      // LOGGED IN
      // ----------------------------------------------------------

      // User has a valid session.
      // Reveal the protected page normally.

      document.documentElement.style.visibility =
        "visible";

    } catch (error) {

      console.error(
        "Authentication check failed:",
        error
      );

      // Treat authentication errors as unauthenticated.

      window.showAuthGuardModal();

    }

  }


  // ============================================================
  // START AUTHENTICATION CHECK
  // ============================================================

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      checkAuthentication
    );

  } else {

    checkAuthentication();

  }

})();