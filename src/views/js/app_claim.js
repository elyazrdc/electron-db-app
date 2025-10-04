const newClaimForm = document.getElementById('newClaimForm');
const editClaimForm = document.getElementById('editClaimForm');
const author = document.getElementById('author');
const type_cedula = document.getElementById('type_cedula');
const cedula = document.getElementById('cedula');
const tel = document.getElementById('cellphone');
const claim = document.getElementById('claim');
const parroquia = document.getElementById('parroquia');
const casa = document.getElementById('casa');
const date = document.getElementById('date');
const check1 = document.getElementById('check1');
const check2 = document.getElementById('check2');

function getIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

console.log(getIDFromURL());

if (check1) {
    function getCheckValue() {
        if (check1.checked) {
            return 1;
        }
        else if (check2.checked) {
            return 0;
        }
        else {
            return 0;
        }
    }
}

if (newClaimForm) {
    newClaimForm.addEventListener('submit', async (e) => {
        console.log("HELOOOOOOOOO")
        
        const newClaim = {
            author: author.value,
            claim: claim.value,
            parroquia: parroquia.value,
            casa: casa.value,
            attended: getCheckValue(),
            cedula: cedula.value,
            type_cedula: type_cedula.value,
            date: date.value,
            tel: tel.value 
        }
        
        const result = await window.electronAPI.newAsunto(newClaim);
    })
}

if (editClaimForm) {
    editClaimForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updateClaimValues = {
            author: author.value,
            claim: claim.value,
            parroquia: parroquia.value,
            casa: casa.value,
            attended: getCheckValue(),
            cedula: cedula.value,
            type_cedula: type_cedula.value,
            date: date.value,
            tel: tel.value 
        }
        console.log(updateClaimValues);
        const id = getIDFromURL();
        updateClaim(updateClaimValues, id)
    });
}

async function updateClaim(value, id) {
    notifications(1)
    window.electronAPI.updateAsunto(value, id);
    window.location.href = "../claim/crud.html";
}

let asuntosTable = null;

function formatDateSimple(dateString) {
    if (!dateString || dateString === '0000-00-00') return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-VE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function notifications(number) {
    switch (number) {
        case 1:
            new Notification('Informe editado correctamente');
            break;
        case 2:
            new Notification('Informe eliminado correctamente');
            break;
        default:
            break;
    }
}

function checkAttended(value) {
    if (value == 1) {
        return 'Sí';
    }
    else {
        return 'No';
    }
}

const getAsuntos = async () => {
    const result = await window.electronAPI.getAsuntos();
    renderAsuntos(result);
}

async function deleteAsunto(id) {
    const response = confirm('¿Estás seguro de que deseas eliminar esto?');
    if (response) {
        notifications(2);
        await window.electronAPI.deleteAsunto(id);
        getAsuntos();
    }
    else {
        return;
    }
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
                    <td>${checkAttended(asunto.attended)}</td>
                    <td>${formatDateSimple(asunto.date)}</td>
                    <td class="d-flex justify-content-center gap-1">
                        <a href="../claim/edit_claim.html?id=${asunto.id}" class="btn btn-sm btn-warning edit-btn d-flex align-items-center" title="Editar"><i class='bx bx-edit icon'></i></a>
                        <button class="btn btn-sm btn-danger delete-btn d-flex align-items-center" title="Eliminar" onclick="deleteAsunto('${asunto.id}')"><i class='bx bxs-x-circle icon'></i></button>
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


async function init() {
    getAsuntos();
}

init();
