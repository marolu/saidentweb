document.addEventListener("DOMContentLoaded", async function () {
  // const urlParams = new URLSearchParams(window.location.search);
  // const accessToken = urlParams.get("access_token");
  // const refreshToken = urlParams.get("refresh_token");

  // let currentUser = null;

  // if (accessToken && refreshToken) {
  //   console.log("Setting session from URL tokens...");
  //   const { data, error } = await supabase.auth.setSession({
  //     access_token: accessToken,
  //     refresh_tojken: refreshToken,
  //   });

  //   if (error) {
  //     console.error("Error setting session:", error);
  //     alert("Error al establecer la sesión");
  //     return;
  //   }

  //   console.log("Session set successfully:", data);
  //   currentUser = data.user;

  //   window.history.replaceState({}, document.tittle, window.location.pathname);
  // } else {
  //   const {
  //     data: { session },
  //     error,
  //   } = await supabase.auth.getSession();

  //   if (error || !session) {
  //     console.error("No session found");
  //     alert(
  //       "No hay sesión activa. Por favor, inicia sesión desde la aplicación."
  //     );
  //     return;
  //   }

  //   currentUser = session.user;
  // }

  // console.log("Current user:", currentUser);

  // const { data: usuario, error: usuarioError } = await supabase
  //   .from("usuarios")
  //   .select("id_usuario, rol, auth_id")
  //   .eq("auth_id", currentUser.id)
  //   .single();

  // console.log("Usuario data:", usuario);

  // if (usuarioError || !usuario) {
  //   alert("Usuario no encontrado en la base de datos.");
  //   return;
  // }
  // if (usuario.rol !== "odontologo" && usuario.rol !== "admin") {
  //   alert("No tienes permisos para acceder a esta página.");
  //   await supabase.auth.signOut();
  //   return;
  // }

  // console.log("User verified, loading appointments...");

  // const currentPage = window.location.pathname
  //   .split("/")
  //   .pop()
  //   .replace(".html", "");
  // const navLinks = document.querySelectorAll("nar a");

  // navLinks.forEach((link) => {
  //   const linkPage = link.getAttribute("data-page");
  //   if (linkPage === currentPage) {
  //     link.classList.add("active");
  //   } else {
  //     link.classList.remove("active");
  //   }
  // });

  // if (usuario.rol === "odontologo") {
  //   const { data: odontologo, error: odontologoError } = await supabase
  //     .from("odontologos")
  //     .select("id_odontologo, nombre, especialidad, telefono")
  //     .eq("id_usuario", usuario.id_usuario)
  //     .single();

  //   if (odontologoError) {
  //     console.error("Odontologo error:", odontologoError);
  //   }

  //   if (odontologo) {
  //     document.getElementById("userName").textContent =
  //       odontologo.nombre || "No disponible";
  //     document.getElementById("userDNI").textContent =
  //       odontologo.telefono || "No disponible";

  //     // Store odontologo ID for filtering appointments
  //     currentUser.odontologoId = odontologo.id_odontologo;
  //   }
  // } else {
  //   // For admin, just show email or a default name
  //   document.getElementById("userName").textContent = "Administrador";
  //   document.getElementById("userDNI").textContent = "N/A";
  // }

  // async function loadStatistics() {
  //   try {
  //     // Count pending appointments
  //     const { count: pendingCount, error: pendingError } = await supabase
  //       .from("citas")
  //       .select("*", { count: "exact", head: true })
  //       .eq("estado", "pendiente");

  //     if (pendingError) throw pendingError;

  //     // Count finished appointments
  //     const { count: finishedCount, error: finishedError } = await supabase
  //       .from("citas")
  //       .select("*", { count: "exact", head: true })
  //       .eq("estado", "completada");

  //     if (finishedError) throw finishedError;

  //     // Count cancelled appointments
  //     const { count: cancelledCount, error: cancelledError } = await supabase
  //       .from("citas")
  //       .select("*", { count: "exact", head: true })
  //       .eq("estado", "cancelada");

  //     if (cancelledError) throw cancelledError;

  //     // Update UI
  //     document.getElementById("pendingCount").textContent = pendingCount || 0;
  //     document.getElementById("finishedCount").textContent = finishedCount || 0;
  //     document.getElementById("cancelledCount").textContent =
  //       cancelledCount || 0;
  //   } catch (error) {
  //     console.error("Error loading statistics:", error);
  //     showAlert("Error al cargar estadísticas", "error");
  //   }
  // }



  
//   // Function to fetch and display appointments
//   async function loadAppointments() {
//     const container = document.getElementById("tableContainer");

//     try {
//       console.log("Fetching appointments..."); // Debug log

//       const {data: odontologo,error:odontError}=await supabase
//       .from ("odontologo")
//       .select("id_odontologo")
//       .eq("id_usuario", usuario.id_usuario)
//       .single()

//       if (odontError || !odontologo){
//         throw new  Error ("No se encontró el odontologo asociado");
//       }

//       // Fetch appointments with status 'pendiente'
//       const { data, error } = await supabase
//         .from("citas")
//         .select(
//           `
//                     *,
//                     pacientes(nombre)
//                 `
//         )
//         .eq("id_odontologo", odontologo.id_odontologo)
//         .eq("estado", "pendiente")
//         .order("fecha", { ascending: true });

//       console.log("Data received:", data); // Debug log
//       console.log("Error:", error); // Debug log

//       if (error) throw error;

//       // Create table HTML
//       let tableHTML = `
//                 <table>
//                     <tr>
//                         <th>ID</th>
//                         <th>Paciente</th>
//                         <th>Fecha</th>
//                         <th>Hora</th>
//                         <th>Tipo</th>
//                         <th>Opciones</th>
//                     </tr>
//             `;

//       if (data && data.length > 0) {
//         data.forEach((cita) => {
//           tableHTML += `
//                         <tr>
//                             <td>${cita.id_cita}</td>
//                             <td>${cita.pacientes?.nombre || "N/A"}</td>
//                             <td>${cita.fecha || "N/A"}</td>
//                             <td>${cita.hora_inicio || "N/A"}</td>
//                             <td>${cita.tipo_cita || "N/A"}</td>
//                             <td>
//                                 <button onclick="updateStatus(${
//                                   cita.id_cita
//                                 }, 'completada')">Completar</button>
//                                 <button onclick="updateStatus(${
//                                   cita.id_cita
//                                 }, 'cancelada')">Cancelar</button>
//                             </td>
//                         </tr>
//                     `;
//         });
//       } else {
//         tableHTML += `
//                     <tr>
//                         <td colspan="6" style="text-align: center;">No hay citas pendientes</td>
//                     </tr>
//                 `;
//       }

//       tableHTML += "</table>";
//       container.innerHTML = tableHTML;
//     } catch (error) {
//       console.error("Error loading appointments:", error);
//       container.innerHTML = `
//                 <div class="error">
//                     Error al cargar las citas: ${error.message}
//                 </div>
//             `;
//     }
//   }

//   async function loadAppointmentsCancelled() {
//     const container = document.getElementById("tableCancelled");

//     try {
//       console.log("Fetching appointments..."); // Debug log


//       const {data: odontologo,error:odontError}=await supabase
//       .from ("odontologo")
//       .select("id_odontologo")
//       .eq("id_usuario", usuario.id_usuario)
//       .single()

//       if (odontError || !odontologo){
//         throw new  Error ("No se encontró el odontologo asociado");
//       }

      
//       // Fetch appointments with status 'pendiente'
//       const { data, error } = await supabase
//         .from("citas")
//         .select(
//           `
//                     *,
//                     pacientes(nombre)
//                 `
//         )
//         .eq("id_odontologo", odontologo.id_odontologo)
//         .eq("estado", "cancelada")
//         .order("fecha", { ascending: true });

//       console.log("Data received:", data); // Debug log
//       console.log("Error:", error); // Debug log

//       if (error) throw error;

//       // Create table HTML
//       let tableHTML = `
//                 <table>
//                     <tr>
//                         <th>ID</th>
//                         <th>Paciente</th>
//                         <th>Fecha</th>
//                         <th>Hora</th>
//                         <th>Tipo de Cita</th>
//                     </tr>
//             `;

//       if (data && data.length > 0) {
//         data.forEach((cita) => {
//           tableHTML += `
//                         <tr>
//                             <td>${cita.id_cita}</td>
//                             <td>${cita.pacientes?.nombre || "N/A"}</td>
//                             <td>${cita.fecha || "N/A"}</td>
//                             <td>${cita.hora_inicio || "N/A"}</td>
//                             <td>${cita.tipo_cita || "N/A"}</td>
//                         </tr>
//                     `;
//         });
//       } else {
//         tableHTML += `
//                     <tr>
//                         <td colspan="6" style="text-align: center;">No hay citas pendientes</td>
//                     </tr>
//                 `;
//       }

//       tableHTML += "</table>";
//       container.innerHTML = tableHTML;
//     } catch (error) {
//       console.error("Error loading appointments:", error);
//       container.innerHTML = `
//                 <div class="error">
//                     Error al cargar las citas: ${error.message}
//                 </div>
//             `;
//     }
//   }

//   async function loadAppointmentsFinal() {
//     const container = document.getElementById("tableFinal");

//     try {
//       console.log("Fetching appointments..."); // Debug log


//        const {data: odontologo,error:odontError}=await supabase
//       .from ("odontologo")
//       .select("id_odontologo")
//       .eq("id_usuario", usuario.id_usuario)
//       .single()

//       if (odontError || !odontologo){
//         throw new  Error ("No se encontró el odontologo asociado");
//       }



//       // Fetch appointments with status 'pendiente'
//       const { data, error } = await supabase
//         .from("citas")
//         .select(
//           `
//                     *,
//                     pacientes(nombre)
//                 `
//         )
//         .eq("id_odontologo", odontologo.id_odontologo)
//         .eq("estado", "completada")
//         .order("fecha", { ascending: true });

//       console.log("Data received:", data); // Debug log
//       console.log("Error:", error); // Debug log

//       if (error) throw error;

//       // Create table HTML
//       let tableHTML = `
//                 <table>
//                     <tr>
//                         <th>ID</th>
//                         <th>Paciente</th>
//                         <th>Fecha</th>
//                         <th>Hora</th>
//                         <th>Tipo</th>
//                     </tr>
//             `;

//       if (data && data.length > 0) {
//         data.forEach((cita) => {
//           tableHTML += `
//                         <tr>
//                             <td>${cita.id_cita}</td>
//                             <td>${cita.pacientes?.nombre || "N/A"}</td>
//                             <td>${cita.fecha || "N/A"}</td>
//                             <td>${cita.hora_inicio || "N/A"}</td>
//                             <td>${cita.tipo_cita || "N/A"}</td>
//                         </tr>
//                     `;
//         });
//       } else {
//         tableHTML += `
//                     <tr>
//                         <td colspan="6" style="text-align: center;">No hay citas pendientes</td>
//                     </tr>
//                 `;
//       }

//       tableHTML += "</table>";
//       container.innerHTML = tableHTML;
//     } catch (error) {
//       console.error("Error loading appointments:", error);
//       container.innerHTML = `
//                 <div class="error">
//                     Error al cargar las citas: ${error.message}
//                 </div>
//             `;
//     }
//   }

//   // Function to update appointment status
//   window.updateStatus = async function (citaId, newStatus) {
//     try {
//       const { error } = await supabase
//         .from("citas")
//         .update({ estado: newStatus })
//         .eq("id_cita", citaId);

//       if (error) throw error;

//       // Reload appointments after update
//       alert(
//         `Cita ${
//           newStatus === "finalizado" ? "finalizada" : "cancelada"
//         } exitosamente`
//       );
//       loadAppointments();
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert("Error al actualizar el estado de la cita: " + error.message);
//     }
//   };

//   window.currentUserData ={
//     user: currentUser,
//     usuario: usuario,
//     supabase: supabase
//   }

//   loadUserProfile();
//   loadStatistics();
//   loadAppointments();
//   loadAppointmentsCancelled();
//   loadAppointmentsFinal();
// });

// Load user profile
// async function loadUserProfile() {
//   try {
//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError) throw authError;
//     if (!user) {
//       window.location.href = "../html/login.html";
//       return;
//     }
//   }
// }
// // Handle profile picture upload
// document.getElementById('fileInput').addEventListener('change', async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//         showAlert('Por favor selecciona un archivo de imagen válido', 'error');
//         return;
//     }

//     // Validate file size (max 2MB)
//     if (file.size > 2 * 1024 * 1024) {
//         showAlert('La imagen no debe superar los 2MB', 'error');
//         return;
//     }

//     try {
//         // Preview image immediately
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             document.getElementById('profilePic').src = e.target.result;
//         };
//         reader.readAsDataURL(file);

//         // Upload to Supabase Storage
//         const fileExt = file.name.split('.').pop();
//         const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;

//         const { data: uploadData, error: uploadError } = await supabase.storage
//             .from('profile-pictures') // Make sure this bucket exists
//             .upload(fileName, file, {
//                 cacheControl: '3600',
//                 upsert: true
//             });

//         if (uploadError) throw uploadError;

//         // Get public URL
//         const { data: { publicUrl } } = supabase.storage
//             .from('profile-pictures')
//             .getPublicUrl(fileName);

//         // Update profile in database
//         const { error: updateError } = await supabase
//             .from('profiles')
//             .update({ foto_url: publicUrl })
//             .eq('user_id', currentUser.id);

//         if (updateError) throw updateError;

//         showAlert('Foto de perfil actualizada exitosamente', 'success');

//     } catch (error) {
//         console.error('Error uploading picture:', error);
//         showAlert('Error al subir la foto: ' + error.message, 'error');
//     }
// });

// // Edit profile function
// function editProfile() {
//     // Implement edit profile modal or redirect to edit page
//     showAlert('Función de edición en desarrollo', 'error');
// }

// Logout function
// async function logout() {
//     try {
//         const { error } = await supabase.auth.signOut();
//         if (error) throw error;

//         window.location.href = '../html/index.html';
//     } catch (error) {
//         console.error('Logout error:', error);
//         showAlert('Error al cerrar sesión: ' + error.message, 'error');
//     }
// }


async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // Clear session data
        sessionStorage.clear();
        localStorage.clear();

        window.location.href = '../html/index.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error al cerrar sesión: ' + error.message);
    }
}

logout()
     


//Load data on page load
window.addEventListener('DOMContentLoaded', () => {
    // Set active navigation
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('data-page');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    })
})

  })

// Load profile and statistic
