// Lógica de formulario 
document.addEventListener('DOMContentLoaded', function () {
    const anonimoSelect = document.getElementById('anonimo');
    const datosUsuario = document.getElementById('datosUsuario');
    const problemaSelect = document.getElementById('problema');
    const detalleOtro = document.getElementById('detalleOtro');
    const formReporte = document.querySelector('form[method="post"]');

    // Mostrar u ocultar datos personales según anonimato
    if (anonimoSelect && datosUsuario) {
        anonimoSelect.addEventListener('change', function () {
            if (this.value === 'si') {
                datosUsuario.style.display = 'none';
                datosUsuario.querySelectorAll('input').forEach(input => input.value = '');
            } else {
                datosUsuario.style.display = 'flex';
            }
        });
    }

    // Mostrar área de texto si elige "otro"
    if (problemaSelect && detalleOtro) {
        problemaSelect.addEventListener('change', function () {
            if (this.value === 'otro') {
                detalleOtro.style.display = 'flex';
            } else {
                detalleOtro.style.display = 'none';
                const descripcion = document.getElementById('descripcion');
                if (descripcion) descripcion.value = '';
            }
        });
    }

    // Validar formulario antes de enviar
    if (formReporte) {
        formReporte.addEventListener('submit', function (e) {
            const ubicacion = document.getElementById('ubicacion');
            if (ubicacion && !ubicacion.value) {
                e.preventDefault();
                alert('Por favor, selecciona una ubicación en el mapa.');
            }
        });
    }
});

// Mapa y geolocalización
let map, samariaPolygon, marcador;

function initMap() {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    const samariaCenter = { lat: 9.0494, lng: -79.4953 };
    map = new google.maps.Map(mapElement, {
        zoom: 16,
        center: samariaCenter,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        mapTypeIds: ['roadmap', 'satellite']
    });

    const samariaCoords = [
        { lat: 9.060863, lng: -79.495139 },
        { lat: 9.060694, lng: -79.496298 },
        { lat: 9.058871, lng: -79.497371 },
        { lat: 9.05849, lng: -79.498057 },
        { lat: 9.057303, lng: -79.498959 },
        { lat: 9.054125, lng: -79.498744 },
        { lat: 9.053108, lng: -79.499688 },
        { lat: 9.052811, lng: -79.501104 },
        { lat: 9.048594, lng: -79.500178 },
        { lat: 9.048149, lng: -79.496509 },
        { lat: 9.048615, lng: -79.496595 },
        { lat: 9.049421, lng: -79.496273 },
        { lat: 9.04906, lng: -79.494063 },
        { lat: 9.048139, lng: -79.494153 },
        { lat: 9.047962, lng: -79.492877 },
        { lat: 9.048164, lng: -79.492469 },
        { lat: 9.049021, lng: -79.492239 },
        { lat: 9.049071, lng: -79.491499 },
        { lat: 9.051339, lng: -79.490785 },
        { lat: 9.05207, lng: -79.490428 },
        { lat: 9.052322, lng: -79.489483 },
        { lat: 9.051818, lng: -79.489177 },
        { lat: 9.053582, lng: -79.488182 },
        { lat: 9.053884, lng: -79.489228 },
        { lat: 9.053756, lng: -79.490145 },
        { lat: 9.054285, lng: -79.490426 },
        { lat: 9.055117, lng: -79.489915 },
        { lat: 9.059426, lng: -79.49285 },
        { lat: 9.060913, lng: -79.493743 },
        { lat: 9.060862, lng: -79.49456 }
    ];

    samariaPolygon = new google.maps.Polygon({
        paths: samariaCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        clickable: false
    });
    samariaPolygon.setMap(map);

    // Manejar clics para guardar coordenadas
    map.addListener("click", function(e) {
        const punto = e.latLng;
        if (google.maps.geometry.poly.containsLocation(punto, samariaPolygon)) {
            const lat = punto.lat().toFixed(6);
            const lng = punto.lng().toFixed(6);
            const coords = `${lat}, ${lng}`;
            
            const ubicacionInput = document.getElementById("ubicacion");
            const ubicacionTexto = document.getElementById("ubicacion-texto");
            
            if (ubicacionInput) ubicacionInput.value = coords;
            if (ubicacionTexto) ubicacionTexto.value = coords;

            if (marcador) marcador.setMap(null);
            marcador = new google.maps.Marker({
                position: punto,
                map: map,
                title: "Ubicación seleccionada: " + coords
            });
        } else {
            alert("Por favor, selecciona un punto dentro del área de Samaria.");
        }
    });
}

// Función para mostrar notificación emergente
function showToast(message, isSuccess) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${isSuccess ? 'toast-success' : 'toast-error'}`;
    toast.innerHTML = `
        <div class="toast-icon">
            ${isSuccess ? '✓' : '⚠'}
        </div>
        <div class="toast-message">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Mostrar mensaje si hay parámetros en la URL
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    
    if (status) {
        const notification = document.createElement('div');
        const icon = document.createElement('span');
        
        if (status === 'success') {
            notification.className = 'notification-center notification-success';
            icon.className = 'notification-icon';
            icon.innerHTML = '✓';
            notification.innerHTML = '¡Reporte enviado con éxito!';
        } else {
            notification.className = 'notification-center notification-error';
            icon.className = 'notification-icon';
            icon.innerHTML = '⚠';
            const message = urlParams.get('message') || 'Error al enviar el reporte';
            notification.innerHTML = message;
        }
        
        notification.prepend(icon);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
            history.replaceState({}, '', window.location.pathname);
        }, 3000);
    }
});

// Carga la API de Google Maps
if (window.location.search.includes('status=')) {
    setTimeout(() => {
        history.replaceState({}, document.title, window.location.pathname);
    }, 5000);
}