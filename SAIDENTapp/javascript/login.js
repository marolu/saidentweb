// Initialize Supabase client
// const SUPABASE_URL = "https://gqzmibsyfmyrjlxqfxed.supabase.co";
// const SUPABASE_ANON_KEY =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxem1pYnN5Zm15cmpseHFmeGVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzYzODQ4NiwiZXhwIjoyMDczMjE0NDg2fQ.cIBvpeNa1KvdyvBl_ciLQ2GCmIFEZGHBG3F4SR4Q3Zk";

// const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
//   auth: {
//     autoRefreshToken: true,
//     persistSession: true,
//   },
//   db: {
//     schema: "public",
//   },
// });

// Toggle password visibility
function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.querySelector(".toggle-password");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleBtn.textContent = "Ocultar";
  } else {
    passwordInput.type = "password";
    toggleBtn.textContent = "Mostrar";
  }
}

// Show alert message
function showAlert(message, type) {
  const alertDiv = document.getElementById("alertMessage");
  alertDiv.textContent = message;
  alertDiv.className = `alert ${type}`;
  alertDiv.style.display = "block";

  setTimeout(() => {
    alertDiv.style.display = "none";
  }, 5000);
}

// Check if user is already logged in and setup form
window.addEventListener("DOMContentLoaded", async () => {
  try {
    // Check for existing session
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Session check error:", error);
    }

    if (session) {
      console.log("User already logged in, redirecting...");
      window.location.href = "../html/citaspen.html";
      return;
    }

    // Setup login form listener
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) {
      console.error("Login form not found! Make sure your form has id='loginForm'");
      return;
    }

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const loginBtn = document.getElementById("loginBtn");

      // Validate inputs
      if (!email || !password) {
        showAlert("Por favor ingresa correo y contraseña", "error");
        return;
      }

      // Disable button during login
      loginBtn.disabled = true;
      loginBtn.textContent = "Iniciando sesión...";

      try {
        // Sign in with Supabase Auth (corrected: use 'email' not 'correo')
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) throw error;

        // Successfully logged in
        console.log("Login successful:", data);

        // Optional: Fetch additional user profile data from your custom tables
        if (data.user) {
          const { data: userData, error: userError } = await supabase
            .from("usuario")
            .select("id_usuario, correo, rol, creado_en")
            .eq("auth_id", data.user.id)
            .single();

          if (userError) {
            console.warn("Could not fetch user profile:", userError);
          } else {
            console.log("User profile:", userData);
            // Store additional user data if needed
            sessionStorage.setItem("userProfile", JSON.stringify(userData));
          }
        }

        showAlert("¡Inicio de sesión exitoso!", "success");

        // Redirect to appointments page after successful login
        setTimeout(() => {
          window.location.href = "../html/citaspen.html";
        }, 1500);

      } catch (error) {
        console.error("Login error:", error);
        
        // Show user-friendly error messages
        let errorMessage = "Error al iniciar sesión. Verifica tus credenciales.";
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Correo o contraseña incorrectos";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Por favor confirma tu correo electrónico";
        } else if (error.message.includes("network")) {
          errorMessage = "Error de conexión. Verifica tu internet.";
        }
        
        showAlert(errorMessage, "error");
        
      } finally {
        // Re-enable button
        loginBtn.disabled = false;
        loginBtn.textContent = "Iniciar Sesión";
      }
    });

  } catch (error) {
    console.error("Error during initialization:", error);
  }
});

// Optional: Add session state listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth state changed:", event, session);
  
  if (event === 'SIGNED_OUT') {
    // Handle sign out
    sessionStorage.clear();
  } else if (event === 'SIGNED_IN') {
    // Handle sign in
    console.log("User signed in:", session.user);
  }
});