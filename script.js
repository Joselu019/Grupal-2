// CLASES DE RESERVAS

    class Reserva { // Reserva base
        #cliente;
        #fechaEntrada;
        #fechaSalida;
    
        constructor(cliente, fechaEntrada, fechaSalida, tarifaBase = 0) { // Constructor de la clase Reserva
        this.#cliente = cliente;
        this.#fechaEntrada = new Date(fechaEntrada);
        this.#fechaSalida = new Date(fechaSalida);
        this.tarifaBase = tarifaBase;
        }
    
        get cliente() { // Getter para obtener el cliente
        return this.#cliente;
        }
    
        set cliente(nuevoCliente) { // Setter para establecer el cliente
        this.#cliente = nuevoCliente;
        }
    
        calcularNoches() { // Método para calcular el número de noches entre fecha de entrada y salida
        const msPorNoche = 1000 * 60 * 60 * 24;
        return Math.round((this.#fechaSalida - this.#fechaEntrada) / msPorNoche);
        }
    
        calcularPrecioTotal() { // Método para calcular el precio total de la reserva
        return this.calcularNoches() * this.tarifaBase;
        }
    }
    
    class ReservaPremium extends Reserva { // Reserva Premium que hereda de Reserva
        constructor(cliente, fechaEntrada, fechaSalida, tarifaPremium) {
        super(cliente, fechaEntrada, fechaSalida, tarifaPremium);
        }
    
        calcularPrecioTotal() { // Método para calcular el precio total de la reserva premium
        return this.calcularNoches() * this.tarifaBase;
        }
    }
    Object.freeze(ReservaPremium); // Evita que se modifique la clase ReservaPremium
    
    class ReservaConDesayuno extends Reserva { // Reserva con desayuno que hereda de Reserva
        constructor(cliente, fechaEntrada, fechaSalida, tarifaBase, tarifaDesayuno) {
        super(cliente, fechaEntrada, fechaSalida, tarifaBase);
        this.tarifaDesayuno = tarifaDesayuno;
        }
    
        calcularPrecioTotal() { // Método para calcular el precio total de la reserva con desayuno
        const noches = super.calcularNoches();
        return noches * (this.tarifaBase + this.tarifaDesayuno);
        }
    }
    
    // LÓGICA DE FORMULARIO E HISTORIAL
    
    
    const form = document.getElementById('reserva-form'); // Obtiene el formulario por su ID
    const resultadoDiv = document.getElementById('resultado');
    const abrirHistorialBtn = document.getElementById('abrirHistorial'); // Botón para abrir el historial de reservas
    const modal = document.getElementById('modal');
    const cerrarModalBtn = document.getElementById('cerrarModal');
    const listaHistorial = document.getElementById('listaHistorial');
    
    const historialReservas = []; // Array para almacenar el historial de reservas
    
const tipoReserva = document.getElementById('tipoReserva');
const extraInput = document.getElementById('extra');
const extraContainer = extraInput.closest('div') || extraInput.parentElement; // Encuentra el contenedor del input extra

function actualizarExtra() { // Función para actualizar la visibilidad del campo extra según el tipo de reserva
    if (tipoReserva.value !== 'estandar') {
        extraContainer.style.display = '';
    } else {
        extraContainer.style.display = 'none';
        extraInput.value = '';
    }
}

// Inicializa el estado al cargar
actualizarExtra();

tipoReserva.addEventListener('change', actualizarExtra); // Escucha el cambio en el tipo de reserva para mostrar/ocultar el campo extra

    form.addEventListener('submit', function (e) { // Evento submit del formulario
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
    
        const cliente = document.getElementById('cliente').value;
        const entrada = document.getElementById('fechaEntrada').value;
        const salida = document.getElementById('fechaSalida').value;
        const tipo = document.getElementById('tipoReserva').value;
        const base = parseFloat(document.getElementById('tarifaBase').value) || 0;
        const extra = parseFloat(document.getElementById('extra').value) || 0;
    
        let reserva;
        let precio = 0;
    
        // Validación de campos
        switch (tipo) {
        case 'premium':
            reserva = new ReservaPremium(cliente, entrada, salida, base + extra);
            break;
        case 'desayuno':
            reserva = new ReservaConDesayuno(cliente, entrada, salida, base, extra);
            break;
        default:
            reserva = new Reserva(cliente, entrada, salida, base);
            break;
        }
    
        precio = reserva.calcularPrecioTotal(); // Calcula el precio total de la reserva
    
        let mensaje = `Cliente: ${reserva.cliente}<br>Noches: ${reserva.calcularNoches()}<br>Precio Total: ${precio.toFixed(2)} €`; // Mensaje a mostrar en el resultado
    
        resultadoDiv.innerHTML = mensaje; // Muestra el resultado en el div correspondiente
    
        // Guardar en historial
        historialReservas.push({
        cliente: reserva.cliente,   // Guarda el cliente
        noches: reserva.calcularNoches(),   // Calcula el número de noches
        tipo,
        precio
        });
    
        form.reset();   // Resetea el formulario después de enviar
    });
    
    
    // MODAL - HISTORIAL DE RESERVAS
    
    abrirHistorialBtn.addEventListener('click', () => {     // Evento para abrir el modal del historial de reservas
        listaHistorial.innerHTML = '';
    
        if (historialReservas.length === 0) {   // Si no hay reservas, muestra un mensaje
        listaHistorial.innerHTML = '<li>No hay reservas registradas.</li>';
        } else {
        historialReservas.forEach((r, i) => {   // Recorre el historial de reservas y crea un elemento de lista por cada reserva
            const item = document.createElement('li');  // Crea un nuevo elemento de lista
            item.innerHTML = `#${i + 1} - Cliente: <strong>${r.cliente}</strong><br>
            Noches: ${r.noches} | Tipo: ${r.tipo} | Precio: ${r.precio.toFixed(2)} €`;
            listaHistorial.appendChild(item);   // Añade el elemento de lista al historial
        });
        }
    
        modal.style.display = 'block';
    });
    
    cerrarModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
        modal.style.display = 'none';
        }
    });
    
    