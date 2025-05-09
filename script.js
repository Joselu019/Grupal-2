    // ===============================
    // LÓGICA DE RESERVAS
    // ===============================

    /**
     * Clase base para gestionar reservas estándar.
     */
    class Reserva {
        #cliente;
        #fechaEntrada;
        #fechaSalida;
    
        constructor(cliente, fechaEntrada, fechaSalida) {
        this.#cliente = cliente;
        this.#fechaEntrada = new Date(fechaEntrada);
        this.#fechaSalida = new Date(fechaSalida);
        }
    
        get cliente() {
        return this.#cliente;
        }
    
        set cliente(nuevoCliente) {
        this.#cliente = nuevoCliente;
        }
    
        /**
         * Calcula el número de noches entre dos fechas.
         * @returns {number}
         */
        calcularNoches() {
        const msPorNoche = 1000 * 60 * 60 * 24;
        return Math.round((this.#fechaSalida - this.#fechaEntrada) / msPorNoche);
        }
    }
    
    /**
     * Clase que representa una reserva con tarifa premium.
     */
    class ReservaPremium extends Reserva {
        constructor(cliente, fechaEntrada, fechaSalida, tarifaPremium) {
        super(cliente, fechaEntrada, fechaSalida);
        this.tarifaPremium = tarifaPremium;
        }
    
        /**
         * Calcula el precio total de la reserva premium.
         * @returns {number}
         */
        calcularPrecioTotal() {
        return this.calcularNoches() * this.tarifaPremium;
        }
    }
    
    Object.freeze(ReservaPremium); // Bloquea la clase para que no sea extendida (simula "final")
    
    /**
     * Clase que representa una reserva con desayuno incluido.
     */
    class ReservaConDesayuno extends Reserva {
        constructor(cliente, fechaEntrada, fechaSalida, tarifaBase, tarifaDesayuno) {
        super(cliente, fechaEntrada, fechaSalida);
        this.tarifaBase = tarifaBase;
        this.tarifaDesayuno = tarifaDesayuno;
        }
    
        /**
         * Calcula el precio total de la reserva con desayuno.
         * @returns {number}
         */
        calcularPrecioTotal() {
        const noches = super.calcularNoches();
        return noches * (this.tarifaBase + this.tarifaDesayuno);
        }
    }
    
    // ===============================
    // INTERFAZ Y FUNCIONALIDAD
    // ===============================
    
    const form = document.getElementById('reserva-form');
    const resultadoDiv = document.getElementById('resultado');
    
    form.addEventListener('submit', function (e) {
        e.preventDefault();
    
        const cliente = document.getElementById('cliente').value;
        const entrada = document.getElementById('fechaEntrada').value;
        const salida = document.getElementById('fechaSalida').value;
        const tipo = document.getElementById('tipoReserva').value;
        const base = parseFloat(document.getElementById('tarifaBase').value) || 0;
        const extra = parseFloat(document.getElementById('extra').value) || 0;
    
        let reserva;
    
        switch (tipo) {
        case 'premium':
            reserva = new ReservaPremium(cliente, entrada, salida, base + extra);
            break;
        case 'desayuno':
            reserva = new ReservaConDesayuno(cliente, entrada, salida, base, extra);
            break;
        default:
            reserva = new Reserva(cliente, entrada, salida);
            break;
        }
    
        let mensaje = `Cliente: ${reserva.cliente}<br>Noches: ${reserva.calcularNoches()}`;
    
        if (typeof reserva.calcularPrecioTotal === 'function') {
        mensaje += `<br>Precio Total: ${reserva.calcularPrecioTotal().toFixed(2)} €`;
        }
    
        resultadoDiv.innerHTML = mensaje;
    });
    