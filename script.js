// CLASES DE RESERVAS

    class Reserva {
        #cliente;
        #fechaEntrada;
        #fechaSalida;
    
        constructor(cliente, fechaEntrada, fechaSalida, tarifaBase = 0) {
        this.#cliente = cliente;
        this.#fechaEntrada = new Date(fechaEntrada);
        this.#fechaSalida = new Date(fechaSalida);
        this.tarifaBase = tarifaBase;
        }
    
        get cliente() {
        return this.#cliente;
        }
    
        set cliente(nuevoCliente) {
        this.#cliente = nuevoCliente;
        }
    
        calcularNoches() {
        const msPorNoche = 1000 * 60 * 60 * 24;
        return Math.round((this.#fechaSalida - this.#fechaEntrada) / msPorNoche);
        }
    
        calcularPrecioTotal() {
        return this.calcularNoches() * this.tarifaBase;
        }
    }
    
    class ReservaPremium extends Reserva {
        constructor(cliente, fechaEntrada, fechaSalida, tarifaPremium) {
        super(cliente, fechaEntrada, fechaSalida, tarifaPremium);
        }
    
        calcularPrecioTotal() {
        return this.calcularNoches() * this.tarifaBase;
        }
    }
    Object.freeze(ReservaPremium);
    
    class ReservaConDesayuno extends Reserva {
        constructor(cliente, fechaEntrada, fechaSalida, tarifaBase, tarifaDesayuno) {
        super(cliente, fechaEntrada, fechaSalida, tarifaBase);
        this.tarifaDesayuno = tarifaDesayuno;
        }
    
        calcularPrecioTotal() {
        const noches = super.calcularNoches();
        return noches * (this.tarifaBase + this.tarifaDesayuno);
        }
    }
    
    // LÓGICA DE FORMULARIO E HISTORIAL
    
    
    const form = document.getElementById('reserva-form');
    const resultadoDiv = document.getElementById('resultado');
    const abrirHistorialBtn = document.getElementById('abrirHistorial');
    const modal = document.getElementById('modal');
    const cerrarModalBtn = document.getElementById('cerrarModal');
    const listaHistorial = document.getElementById('listaHistorial');
    
    const historialReservas = [];
    
    form.addEventListener('submit', function (e) {
        e.preventDefault();
    
        const cliente = document.getElementById('cliente').value;
        const entrada = document.getElementById('fechaEntrada').value;
        const salida = document.getElementById('fechaSalida').value;
        const tipo = document.getElementById('tipoReserva').value;
        const base = parseFloat(document.getElementById('tarifaBase').value) || 0;
        const extra = parseFloat(document.getElementById('extra').value) || 0;
    
        let reserva;
        let precio = 0;
    
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
    
        precio = reserva.calcularPrecioTotal();
    
        let mensaje = `Cliente: ${reserva.cliente}<br>Noches: ${reserva.calcularNoches()}<br>Precio Total: ${precio.toFixed(2)} €`;
    
        resultadoDiv.innerHTML = mensaje;
    
        // Guardar en historial
        historialReservas.push({
        cliente: reserva.cliente,
        noches: reserva.calcularNoches(),
        tipo,
        precio
        });
    
        form.reset();
    });
    
    
    // MODAL - HISTORIAL DE RESERVAS
    
    abrirHistorialBtn.addEventListener('click', () => {
        listaHistorial.innerHTML = '';
    
        if (historialReservas.length === 0) {
        listaHistorial.innerHTML = '<li>No hay reservas registradas.</li>';
        } else {
        historialReservas.forEach((r, i) => {
            const item = document.createElement('li');
            item.innerHTML = `#${i + 1} - Cliente: <strong>${r.cliente}</strong><br>
            Noches: ${r.noches} | Tipo: ${r.tipo} | Precio: ${r.precio.toFixed(2)} €`;
            listaHistorial.appendChild(item);
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
    