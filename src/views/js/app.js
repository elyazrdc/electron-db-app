// Login Form Handling
const loginForm = document.getElementById('loginForm');
const user = document.getElementById('user');
const password = document.getElementById('password');

//Formulario Nueva Bolsa
const newBolsaForm = document.getElementById('newBolsaForm');
const nameBolsa = document.getElementById('name-bolsa');
const lastnameBolsa = document.getElementById('lastname-bolsa');
const cedulaBolsa = document.getElementById('cedula-bolsa');

//const tableBolsas = document.getElementById('table_bolsas');
//const tableBolsasBody = document.getElementById('table_bolsas_body');
if (newBolsaForm) {
    newBolsaForm.addEventListener('submit', async (e) => {
        const newBolsa = {
            name: nameBolsa.value,
            lastname: lastnameBolsa.value,
            cedula: cedulaBolsa.value
        }
        const result = await window.electronAPI.newBolsa(newBolsa);
    });
};




let bolsasTable = null;
let asuntosTable = null;

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("submiting");
    console.log(user.value);
    console.log(password.value);
    
    const userLogin = {
        name: user.value,
        password: password.value
    };
    const checkUser = await window.electronAPI.loginUser(userLogin);
});
}


const getAsuntos = async () => {
    const result = await window.electronAPI.getAsuntos();
    renderAsuntos(result);
}

const renderAsuntos = async (asuntos) => {
    if (asuntosTable !== null && typeof asuntosTable.destroy === 'function') {
        asuntosTable.destroy();
        asuntosTable = null;
    }

    // Limpiar el contenido de la tabla manualmente
    const table = document.getElementById('table_claims');
    if (table) {
        table.innerHTML = '';
    }

    console.log(table);
    let index = 0;
    // Crear la estructura de la tabla
    const tableHTML = `
        <thead>
            <tr>
                <th>#</th>
                <th>Autor</th>
                <th>Cédula/RIF</th>
                <th>Télefono</th>
                <th>Asunto</th>
                <th>Parroquia</th>
                <th># de casa/Local</th>
                <th>Atendido</th>
                <th>Fecha</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            ${asuntos.map((asunto, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${asunto.author}</td>
                    <td>${asunto.type_cedula}-${asunto.cedula}</td>
                    <td>${asunto.tel}</td>
                    <td>${asunto.claim}</td>
                    <td>${asunto.parroquia}</td>
                    <td>${asunto.casa}</td>
                    <td>${asunto.attended}</td>
                    <td>${asunto.date}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${asunto.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${asunto.id}">Delete</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;

    // Insertar el HTML en la tabla
    table.innerHTML = tableHTML;

    // Inicializar DataTable
    try {
        asuntosTable = $('#table_claims').DataTable({
            language: {
                url: 'https://cdn.datatables.net/plug-ins/2.3.0/i18n/es-MX.json'
            },
        });

        console.log('✅ DataTable inicializada correctamente');
    } catch (error) {
        console.error('❌ Error inicializando DataTable:', error);
        return;
    }

    // Agregar event listeners usando event delegation
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        editBolsa(id);
    });

    $(document).on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        deleteBolsa(id);
    });
}

const getBolsas = async () => {
    // Use the exposed electronAPI to communicate with the main process via ipcRenderer
    const result = await window.electronAPI.getBolsas();
    console.log(result);
    renderBolsas(result);
}

async function deleteBolsa(id) {
    const response = confirm('¿Estás seguro de que deseas eliminar esta bolsa?');
    if (response) {
        new Notification('Bolsa eliminada')
        window.electronAPI.deleteBolsa(id);
        getBolsas();
    }
    else {
        return;
    }
}

const renderBolsas = async (bolsas) => {

    // Verificar si DataTable ya está inicializada y destruirla solo si existe
    if (bolsasTable !== null && typeof bolsasTable.destroy === 'function') {
        bolsasTable.destroy();
        bolsasTable = null;
    }

    // Limpiar el contenido de la tabla manualmente
    const table = document.getElementById('table_bolsas');
    if (table) {
        table.innerHTML = '';
    }

    // Crear la estructura de la tabla
    const tableHTML = `
        <thead>
            <tr>
                <th>Número</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Cédula</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            ${bolsas.map((bolsa, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${bolsa.name}</td>
                    <td>${bolsa.lastname}</td>
                    <td>${bolsa.cedula}</td>
                    <td class="d-flex justify-content-center gap-1">
                        <button class="btn btn-sm btn-warning edit-btn d-flex align-items-center" data-id="${bolsa.id}"><i class='bx bx-edit icon'></i></button>
                        <button class="btn btn-sm btn-danger delete-btn d-flex align-items-center" title="Eliminar" onclick="deleteBolsa('${bolsa.id}')"><i class='bx bxs-x-circle icon'></i></button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;

    // Insertar el HTML en la tabla
    table.innerHTML = tableHTML;

    // Inicializar DataTable
    try {
        bolsasTable = $('#table_bolsas').DataTable({
            language: {
                url: 'https://cdn.datatables.net/plug-ins/2.3.0/i18n/es-MX.json'
            },
            // language: {
            //     paginate: {
            //         previous: '‹',
            //         next: '›'
            //     }
            // }
        });

        console.log('✅ DataTable inicializada correctamente');
    } catch (error) {
        console.error('❌ Error inicializando DataTable:', error);
        return;
    }

    // Agregar event listeners usando event delegation
    // $(document).on('click', '.edit-btn', function() {
    //     const id = $(this).data('id');
    //     editBolsa(id);
    // });

    // $(document).on('click', '.delete-btn', function() {
    //     const id = $(this).data('id');
    //     deleteBolsa(id);
    // });
};

async function init() {
    getBolsas();
    getAsuntos();
}

init();
