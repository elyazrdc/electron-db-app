//Formulario Nueva Bolsa
const newBolsaForm = document.getElementById('newBolsaForm');
const editBolsaForm = document.getElementById('editBolsaForm');
const nameBolsa = document.getElementById('name-bolsa');
const lastnameBolsa = document.getElementById('lastname-bolsa');
const cedulaBolsa = document.getElementById('cedula-bolsa');

// Obtener el ID de la URL
function getIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function notifications(number) {
    switch (number) {
        case 1:
            new Notification('Bolsa editada correctamente');
            break;
        case 2:
            new Notification('Bolsa eliminada correctamente');
            break;
        default:
            break;
    }
}

async function updateBolsa(bolsaValues, id) {
    
    notifications(1)
    window.electronAPI.updateBolsa(bolsaValues, id);
    window.location.href = "../bolsas/crud.html";
}

if (editBolsaForm) {
    editBolsaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updateBolsaValues = {
            name: nameBolsa.value,
            lastname: lastnameBolsa.value,
            cedula: cedulaBolsa.value
        }
        const id = getIDFromURL();
        updateBolsa(updateBolsaValues, id)
    });
}

// document.addEventListener('DOMContentLoaded', async function() {
//     const id = getIDFromURL();
    
//     if (id) {
//         console.log('ID recibido:', id);
        
        
//         const result = await window.electronAPI.editBolsa(id);
//         // Cargar datos basados en el ID
//         nameBolsa.value = result.name;
//         lastnameBolsa.value = result.lastname;
//         cedulaBolsa.value = result.cedula;
        
//         const updateBolsaValues = {
//             name: nameBolsa.value,
//             lastname: lastnameBolsa.value,
//             cedula: cedulaBolsa.value
//         }
//         console.log(updateBolsaValues)
//         //updateBolsa(id, updateBolsaValues)
//         //loadItemData(id);
//     } else {
//         console.log('No se recibió ID');
//     }
// });


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

const getBolsas = async () => {
    // Use the exposed electronAPI to communicate with the main process via ipcRenderer
    const result = await window.electronAPI.getBolsas();
    console.log(result);
    renderBolsas(result);
}

async function deleteBolsa(id) {
    const response = confirm('¿Estás seguro de que deseas eliminar esta bolsa?');
    if (response) {
        notifications(2);
        await window.electronAPI.deleteBolsa(id);
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
                        <a href="../bolsas/edit_bolsa.html?id=${bolsa.id}" class="btn btn-sm btn-warning edit-btn d-flex align-items-center" title="Editar" data-id="${bolsa.id}"><i class='bx bx-edit icon'></i></a>
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
        });

        console.log('✅ DataTable inicializada correctamente');
    } catch (error) {
        console.error('❌ Error inicializando DataTable:', error);
        return;
    }
};

async function init() {
    getBolsas();
}

init();
