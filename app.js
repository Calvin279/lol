class ControlHoras {
    constructor() {
        this.registros = JSON.parse(localStorage.getItem('registros')) || [];
    }

    registrarHoras(nombre, rango, fecha, horaEntrada, horaSalida) {
        const tiempoTrabajado = this.calcularTiempoTrabajado(horaEntrada, horaSalida);
        const registro = {
            nombre,
            rango,
            fecha,
            horaEntrada,
            horaSalida,
            tiempoTrabajado,
            cumplido: tiempoTrabajado >= 180 // 3 horas = 180 minutos
        };

        this.registros.push(registro);
        this.guardarRegistros();
        this.mostrarRegistros();

        if (!registro.cumplido) {
            this.mostrarNotificacion(`${nombre} no cumplió con las 3 horas mínimas`);
        }
    }

    calcularTiempoTrabajado(horaEntrada, horaSalida) {
        const entrada = new Date(`2000/01/01 ${horaEntrada}`);
        const salida = new Date(`2000/01/01 ${horaSalida}`);
        const diferencia = (salida - entrada) / (1000 * 60); // minutos
        return diferencia;
    }

    guardarRegistros() {
        localStorage.setItem('registros', JSON.stringify(this.registros));
    }

    mostrarRegistros(filtro = '') {
        const tbody = document.getElementById('registroBody');
        tbody.innerHTML = '';

        const registrosFiltrados = this.registros.filter(registro => 
            registro.nombre.toLowerCase().includes(filtro.toLowerCase())
        );

        registrosFiltrados.forEach(registro => {
            const fila = document.createElement('tr');
            fila.classList.add(registro.cumplido ? 'cumplido' : 'incumplido');
            
            const estadoIcono = registro.cumplido ? '✔' : '✘';
            
            fila.innerHTML = `
                <td>${registro.nombre}</td>
                <td>${registro.rango}</td>
                <td>${registro.fecha}</td>
                <td>${registro.horaEntrada}</td>
                <td>${registro.horaSalida}</td>
                <td>${this.formatearTiempo(registro.tiempoTrabajado)}</td>
                <td>${estadoIcono}</td>
            `;
            tbody.appendChild(fila);
        });
    }

    formatearTiempo(minutos) {
        const horas = Math.floor(minutos / 60);
        const mins = Math.floor(minutos % 60);
        const segs = Math.round((minutos % 1) * 60);
        return `${horas}h ${mins}m ${segs}s`;
    }

    mostrarNotificacion(mensaje) {
        const notificacion = document.getElementById('notificacion');
        notificacion.textContent = mensaje;
        notificacion.style.display = 'block';
        
        setTimeout(() => {
            notificacion.style.display = 'none';
        }, 3000);
    }
}

const controlHoras = new ControlHoras();

document.getElementById('horasForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const rango = document.getElementById('rango').value;
    const fecha = document.getElementById('fecha').value;
    const horaEntrada = document.getElementById('horaEntrada').value;
    const horaSalida = document.getElementById('horaSalida').value;

    controlHoras.registrarHoras(nombre, rango, fecha, horaEntrada, horaSalida);
    e.target.reset();
});

function buscarEmpleado() {
    const searchInput = document.getElementById('searchInput').value;
    controlHoras.mostrarRegistros(searchInput);
}

// Mostrar registros al cargar la página
controlHoras.mostrarRegistros();