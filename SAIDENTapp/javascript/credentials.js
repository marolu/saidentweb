// Wait for DOM to load
// Supabase client is already initialized in your separate config file
// Make sure your HTML loads the config file first!

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is logged in
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
        console.error("No active session, redirecting to login...");
        window.location.href = '../html/index.html'; // Adjust path to your login page
        return;
    }

    const currentUser = session.user;
    console.log("Logged in user:", currentUser);

    // Get user profile from usuarios table
    let userData = null;
    try {
        const { data: userProfile, error: userError } = await supabase
            .from("usuarios")
            .select("id_usuario, correo, rol, auth_id")
            .eq("auth_id", currentUser.id)
            .single();

        if (userError) {
            console.error("Error fetching user profile:", userError);
            alert("Error al cargar perfil de usuario");
            return;
        }

        userData = userProfile;
        console.log("User profile:", userData);

        // Check if user is an odontologo
        const { data: odontologo, error: odontError } = await supabase
            .from("odontologos")
            .select("id_odontologo")
            .eq("id_usuario", userData.id_usuario)
            .single();

        if (odontError) {
            console.log("User is not an odontologo:", odontError);
            // User might be a patient, handle accordingly
        } else {
            userData.id_odontologo = odontologo.id_odontologo;
            console.log("User is odontologo:", userData.id_odontologo);
        }

    } catch (error) {
        console.error("Error loading user data:", error);
        alert("Error al cargar datos del usuario");
        return;
    }

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
    });

    // Function to fetch and display appointments
    async function loadAppointments() {
        const container = document.getElementById("tableContainer");
        
        if (!container) {
            console.log("tableContainer not found - skipping loadAppointments");
            return;
        }

        try {
            console.log("Fetching pending appointments...");

            let query = supabase
                .from("citas")
                .select(`
                    *,
                    pacientes(nombre, ape_pat, ape_mat)
                `)
                .eq("estado", "pendiente")
                .order("fecha", { ascending: true });

            // Filter by odontologo if user is an odontologo
            if (userData.id_odontologo) {
                query = query.eq("id_odontologo", userData.id_odontologo);
            }

            const { data, error } = await query;

            console.log("Pending appointments data:", data);
            console.log("Error:", error);

            if (error) throw error;

            // Create table HTML
            let tableHTML = `
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Paciente</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Tipo</th>
                        <th>Opciones</th>
                    </tr>
            `;

            if (data && data.length > 0) {
                data.forEach((cita) => {
                    const nombreCompleto = cita.pacientes 
                        ? `${cita.pacientes.nombre} ${cita.pacientes.ape_pat || ''} ${cita.pacientes.ape_mat || ''}`.trim()
                        : "N/A";
                    
                    tableHTML += `
                        <tr>
                            <td>${cita.id_cita}</td>
                            <td>${nombreCompleto}</td>
                            <td>${cita.fecha || "N/A"}</td>
                            <td>${cita.hora_inicio || "N/A"}</td>
                            <td>${cita.tipo_cita || "N/A"}</td>
                            <td>
                                <button onclick="updateStatus(${cita.id_cita}, 'completada')">Completar</button>
                                <button onclick="updateStatus(${cita.id_cita}, 'cancelada')">Cancelar</button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                tableHTML += `
                    <tr>
                        <td colspan="6" style="text-align: center;">No hay citas pendientes</td>
                    </tr>
                `;
            }

            tableHTML += "</table>";
            container.innerHTML = tableHTML;
        } catch (error) {
            console.error("Error loading appointments:", error);
            container.innerHTML = `
                <div class="error">
                    Error al cargar las citas: ${error.message}
                </div>
            `;
        }
    }

    async function loadAppointmentsCancelled() {
        const container = document.getElementById("tableCancelled");
        
        if (!container) {
            console.log("tableCancelled not found - skipping loadAppointmentsCancelled");
            return;
        }

        try {
            console.log("Fetching cancelled appointments...");

            let query = supabase
                .from("citas")
                .select(`
                    *,
                    pacientes(nombre, ape_pat, ape_mat)
                `)
                .eq("estado", "cancelada")
                .order("fecha", { ascending: true });

            // Filter by odontologo if user is an odontologo
            if (userData.id_odontologo) {
                query = query.eq("id_odontologo", userData.id_odontologo);
            }

            const { data, error } = await query;

            console.log("Cancelled appointments data:", data);
            console.log("Error:", error);

            if (error) throw error;

            // Create table HTML
            let tableHTML = `
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Paciente</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Tipo de Cita</th>
                    </tr>
            `;

            if (data && data.length > 0) {
                data.forEach((cita) => {
                    const nombreCompleto = cita.pacientes 
                        ? `${cita.pacientes.nombre} ${cita.pacientes.ape_pat || ''} ${cita.pacientes.ape_mat || ''}`.trim()
                        : "N/A";
                    
                    tableHTML += `
                        <tr>
                            <td>${cita.id_cita}</td>
                            <td>${nombreCompleto}</td>
                            <td>${cita.fecha || "N/A"}</td>
                            <td>${cita.hora_inicio || "N/A"}</td>
                            <td>${cita.tipo_cita || "N/A"}</td>
                        </tr>
                    `;
                });
            } else {
                tableHTML += `
                    <tr>
                        <td colspan="5" style="text-align: center;">No hay citas canceladas</td>
                    </tr>
                `;
            }

            tableHTML += "</table>";
            container.innerHTML = tableHTML;
        } catch (error) {
            console.error("Error loading cancelled appointments:", error);
            container.innerHTML = `
                <div class="error">
                    Error al cargar las citas: ${error.message}
                </div>
            `;
        }
    }

    async function loadAppointmentsFinal() {
        const container = document.getElementById("tableFinal");
        
        if (!container) {
            console.log("tableFinal not found - skipping loadAppointmentsFinal");
            return;
        }

        try {
            console.log("Fetching completed appointments...");

            let query = supabase
                .from("citas")
                .select(`
                    *,
                    pacientes(nombre, ape_pat, ape_mat)
                `)
                .eq("estado", "completada")
                .order("fecha", { ascending: true });

            // Filter by odontologo if user is an odontologo
            if (userData.id_odontologo) {
                query = query.eq("id_odontologo", userData.id_odontologo);
            }

            const { data, error } = await query;

            console.log("Completed appointments data:", data);
            console.log("Error:", error);

            if (error) throw error;

            // Create table HTML
            let tableHTML = `
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Paciente</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Tipo</th>
                    </tr>
            `;

            if (data && data.length > 0) {
                data.forEach((cita) => {
                    const nombreCompleto = cita.pacientes 
                        ? `${cita.pacientes.nombre} ${cita.pacientes.ape_pat || ''} ${cita.pacientes.ape_mat || ''}`.trim()
                        : "N/A";
                    
                    tableHTML += `
                        <tr>
                            <td>${cita.id_cita}</td>
                            <td>${nombreCompleto}</td>
                            <td>${cita.fecha || "N/A"}</td>
                            <td>${cita.hora_inicio || "N/A"}</td>
                            <td>${cita.tipo_cita || "N/A"}</td>
                        </tr>
                    `;
                });
            } else {
                tableHTML += `
                    <tr>
                        <td colspan="5" style="text-align: center;">No hay citas completadas</td>
                    </tr>
                `;
            }

            tableHTML += "</table>";
            container.innerHTML = tableHTML;
        } catch (error) {
            console.error("Error loading completed appointments:", error);
            container.innerHTML = `
                <div class="error">
                    Error al cargar las citas: ${error.message}
                </div>
            `;
        }
    }

    // Function to update appointment status
    window.updateStatus = async function (citaId, newStatus) {
        try {
            const { error } = await supabase
                .from("citas")
                .update({ estado: newStatus })
                .eq("id_cita", citaId);

            if (error) throw error;

            // Reload appointments after update
            alert(`Cita ${newStatus === "completada" ? "completada" : "cancelada"} exitosamente`);
            
            // Reload all tables
            await loadAppointments();
            await loadAppointmentsCancelled();
            await loadAppointmentsFinal();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error al actualizar el estado de la cita: " + error.message);
        }
    };

    // Logout function
    window.logout = async function() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            sessionStorage.clear();
            localStorage.clear();
            window.location.href = '../html/index.html';
        } catch (error) {
            console.error('Logout error:', error);
            alert('Error al cerrar sesión: ' + error.message);
        }
    };

    // Load appointments only if on the appointments page
    loadAppointments();
    loadAppointmentsCancelled();
    loadAppointmentsFinal();
});




















// // Wait for Supabase to load
// document.addEventListener('DOMContentLoaded', async function() {
//     // Set active navigation
//     const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
//     const navLinks = document.querySelectorAll('nav a');
    
//     navLinks.forEach(link => {
//         const linkPage = link.getAttribute('data-page');
//         if (linkPage === currentPage) {
//             link.classList.add('active');
//         } else {
//             link.classList.remove('active');
//         }
//     });

//     // Function to fetch and display appointments
//     async function loadAppointments() {
//         const container = document.getElementById("tableContainer");
        
//         // ✅ CHECK IF ELEMENT EXISTS
//         if (!container) {
//             console.log("tableContainer not found - skipping loadAppointments");
//             return;
//         }

//         try {
//             console.log("Fetching appointments...");

//             // Fetch appointments with status 'pendiente'
//             const { data, error } = await supabase
//                 .from("citas")
//                 .select(`
//                     *,
//                     pacientes(nombre)
//                 `)
//                 .eq("estado", "pendiente")
//                 .order("fecha", { ascending: true });

//             console.log("Data received:", data);
//             console.log("Error:", error);

//             if (error) throw error;

//             // Create table HTML
//             let tableHTML = `
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

//             if (data && data.length > 0) {
//                 data.forEach((cita) => {
//                     tableHTML += `
//                         <tr>
//                             <td>${cita.id_cita}</td>
//                             <td>${cita.pacientes?.nombre || "N/A"}</td>
//                             <td>${cita.fecha || "N/A"}</td>
//                             <td>${cita.hora_inicio || "N/A"}</td>
//                             <td>${cita.tipo_cita || "N/A"}</td>
//                             <td>
//                                 <button onclick="updateStatus(${cita.id_cita}, 'completada')">Completar</button>
//                                 <button onclick="updateStatus(${cita.id_cita}, 'cancelada')">Cancelar</button>
//                             </td>
//                         </tr>
//                     `;
//                 });
//             } else {
//                 tableHTML += `
//                     <tr>
//                         <td colspan="6" style="text-align: center;">No hay citas pendientes</td>
//                     </tr>
//                 `;
//             }

//             tableHTML += "</table>";
//             container.innerHTML = tableHTML;
//         } catch (error) {
//             console.error("Error loading appointments:", error);
//             container.innerHTML = `
//                 <div class="error">
//                     Error al cargar las citas: ${error.message}
//                 </div>
//             `;
//         }
//     }

//     async function loadAppointmentsCancelled() {
//         const container = document.getElementById("tableCancelled");
        
//         // ✅ CHECK IF ELEMENT EXISTS
//         if (!container) {
//             console.log("tableCancelled not found - skipping loadAppointmentsCancelled");
//             return;
//         }

//         try {
//             console.log("Fetching cancelled appointments...");

//             // Fetch appointments with status 'cancelada'
//             const { data, error } = await supabase
//                 .from("citas")
//                 .select(`
//                     *,
//                     pacientes(nombre)
//                 `)
//                 .eq("estado", "cancelada")
//                 .order("fecha", { ascending: true });

//             console.log("Data received:", data);
//             console.log("Error:", error);

//             if (error) throw error;

//             // Create table HTML
//             let tableHTML = `
//                 <table>
//                     <tr>
//                         <th>ID</th>
//                         <th>Paciente</th>
//                         <th>Fecha</th>
//                         <th>Hora</th>
//                         <th>Tipo de Cita</th>
//                     </tr>
//             `;

//             if (data && data.length > 0) {
//                 data.forEach((cita) => {
//                     tableHTML += `
//                         <tr>
//                             <td>${cita.id_cita}</td>
//                             <td>${cita.pacientes?.nombre || "N/A"}</td>
//                             <td>${cita.fecha || "N/A"}</td>
//                             <td>${cita.hora_inicio || "N/A"}</td>
//                             <td>${cita.tipo_cita || "N/A"}</td>
//                         </tr>
//                     `;
//                 });
//             } else {
//                 tableHTML += `
//                     <tr>
//                         <td colspan="5" style="text-align: center;">No hay citas canceladas</td>
//                     </tr>
//                 `;
//             }

//             tableHTML += "</table>";
//             container.innerHTML = tableHTML;
//         } catch (error) {
//             console.error("Error loading cancelled appointments:", error);
//             container.innerHTML = `
//                 <div class="error">
//                     Error al cargar las citas: ${error.message}
//                 </div>
//             `;
//         }
//     }

//     async function loadAppointmentsFinal() {
//         const container = document.getElementById("tableFinal");
        
//         // ✅ CHECK IF ELEMENT EXISTS
//         if (!container) {
//             console.log("tableFinal not found - skipping loadAppointmentsFinal");
//             return;
//         }

//         try {
//             console.log("Fetching completed appointments...");

//             // Fetch appointments with status 'completada'
//             const { data, error } = await supabase
//                 .from("citas")
//                 .select(`
//                     *,
//                     pacientes(nombre)
//                 `)
//                 .eq("estado", "completada")
//                 .order("fecha", { ascending: true });

//             console.log("Data received:", data);
//             console.log("Error:", error);

//             if (error) throw error;

//             // Create table HTML
//             let tableHTML = `
//                 <table>
//                     <tr>
//                         <th>ID</th>
//                         <th>Paciente</th>
//                         <th>Fecha</th>
//                         <th>Hora</th>
//                         <th>Tipo</th>
//                     </tr>
//             `;

//             if (data && data.length > 0) {
//                 data.forEach((cita) => {
//                     tableHTML += `
//                         <tr>
//                             <td>${cita.id_cita}</td>
//                             <td>${cita.pacientes?.nombre || "N/A"}</td>
//                             <td>${cita.fecha || "N/A"}</td>
//                             <td>${cita.hora_inicio || "N/A"}</td>
//                             <td>${cita.tipo_cita || "N/A"}</td>
//                         </tr>
//                     `;
//                 });
//             } else {
//                 tableHTML += `
//                     <tr>
//                         <td colspan="5" style="text-align: center;">No hay citas completadas</td>
//                     </tr>
//                 `;
//             }

//             tableHTML += "</table>";
//             container.innerHTML = tableHTML;
//         } catch (error) {
//             console.error("Error loading completed appointments:", error);
//             container.innerHTML = `
//                 <div class="error">
//                     Error al cargar las citas: ${error.message}
//                 </div>
//             `;
//         }
//     }

//     // Function to update appointment status
//     window.updateStatus = async function (citaId, newStatus) {
//         try {
//             const { error } = await supabase
//                 .from("citas")
//                 .update({ estado: newStatus })
//                 .eq("id_cita", citaId);

//             if (error) throw error;

//             // Reload appointments after update
//             alert(`Cita ${newStatus === "completada" ? "completada" : "cancelada"} exitosamente`);
            
//             // Reload all tables
//             await loadAppointments();
//             await loadAppointmentsCancelled();
//             await loadAppointmentsFinal();
//         } catch (error) {
//             console.error("Error updating status:", error);
//             alert("Error al actualizar el estado de la cita: " + error.message);
//         }
//     };

//     // Load appointments only if on the appointments page
//     loadAppointments();
//     loadAppointmentsCancelled();
//     loadAppointmentsFinal();
// });