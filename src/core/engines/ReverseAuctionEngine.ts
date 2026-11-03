// Motor de Simulación de Subasta Inversa Electrónica - SECOP II
// Conforme al Decreto 1082 de 2015, Artículo 2.2.1.2.1.2.2 y Manual de Subasta Inversa de CCE
export interface LanceSubasta {
  id: string;
  tiempoSegundosRestantes: number;
  horaRegistro: string;
  proponenteId: string;
  nombreProponente: string;
  valorLance: number;
  decrementoAbsoluto: number;
  decrementoPct: number;
  esLanceLider: boolean;
  origen: 'USUARIO' | 'COMPETIDOR_AUTOMATICO';
}

export interface ParticipanteSubasta {
  id: string;
  nombre: string;
  valorInicial: number;
  valorActual: number;
  precioReservaMinimo: number; // Precio mínimo al que el bot está dispuesto a bajar
  agresividad: 'CONSERVADOR' | 'MODERADO' | 'AGRESIVO';
  activo: boolean;
  colorHex: string;
}

export interface EstadoSubastaInversa {
  idProceso: string;
  numeroProceso: string;
  objeto: string;
  presupuestoOficial: number;
  valorArranque: number;
  margenMinimoMejoraCOP: number;
  duracionInicialSegundos: number;
  segundosRestantes: number;
  rondaActual: number;
  estado: 'NO_INICIADA' | 'EN_CURSO' | 'PRORROGA' | 'FINALIZADA' | 'ADJUDICADA';
  mejorLanceActual: LanceSubasta | null;
  historialLances: LanceSubasta[];
  participantes: ParticipanteSubasta[];
}

export class ReverseAuctionEngine {
  /**
   * Inicializa un escenario de subasta inversa electrónica con competidores representativos
   */
  public static crearSubastaInicial(
    idProceso: string,
    numeroProceso: string,
    objeto: string,
    presupuestoOficial: number
  ): EstadoSubastaInversa {
    const valorArranque = Math.round(presupuestoOficial * 0.95);
    const margenMinimo = Math.max(1000000, Math.round(presupuestoOficial * 0.005)); // 0.5% del presupuesto

    const participantes: ParticipanteSubasta[] = [
      {
        id: 'PROV-04',
        nombre: 'SANJUANÉS SOLUCIONES S.A.S. (Licitante)',
        valorInicial: valorArranque,
        valorActual: valorArranque,
        precioReservaMinimo: Math.round(presupuestoOficial * 0.78),
        agresividad: 'AGRESIVO',
        activo: true,
        colorHex: '#c6f24e'
      },
      {
        id: 'PROV-COMP-01',
        nombre: 'CONSORCIO INFRAESTRUCTURA ANDINA',
        valorInicial: Math.round(presupuestoOficial * 0.96),
        valorActual: Math.round(presupuestoOficial * 0.96),
        precioReservaMinimo: Math.round(presupuestoOficial * 0.82),
        agresividad: 'MODERADO',
        activo: true,
        colorHex: '#38bdf8'
      },
      {
        id: 'PROV-COMP-02',
        nombre: 'SUMINISTROS & LOGÍSTICA NACIONAL S.A.S.',
        valorInicial: Math.round(presupuestoOficial * 0.97),
        valorActual: Math.round(presupuestoOficial * 0.97),
        precioReservaMinimo: Math.round(presupuestoOficial * 0.85),
        agresividad: 'CONSERVADOR',
        activo: true,
        colorHex: '#f59e0b'
      },
      {
        id: 'PROV-COMP-03',
        nombre: 'INGENIERÍA & CONSTRUCCIONES DEL CARIBE',
        valorInicial: Math.round(presupuestoOficial * 0.94),
        valorActual: Math.round(presupuestoOficial * 0.94),
        precioReservaMinimo: Math.round(presupuestoOficial * 0.80),
        agresividad: 'AGRESIVO',
        activo: true,
        colorHex: '#ec4899'
      }
    ];

    // El primer mejor lance es la oferta de arranque más baja
    const ofertaMenor = [...participantes].sort((a, b) => a.valorInicial - b.valorInicial)[0];

    const primerLance: LanceSubasta = {
      id: 'LANCE-INICIAL-00',
      tiempoSegundosRestantes: 300,
      horaRegistro: new Date().toLocaleTimeString(),
      proponenteId: ofertaMenor.id,
      nombreProponente: ofertaMenor.nombre,
      valorLance: ofertaMenor.valorInicial,
      decrementoAbsoluto: 0,
      decrementoPct: 0,
      esLanceLider: true,
      origen: ofertaMenor.id === 'PROV-04' ? 'USUARIO' : 'COMPETIDOR_AUTOMATICO'
    };

    return {
      idProceso,
      numeroProceso,
      objeto,
      presupuestoOficial,
      valorArranque: ofertaMenor.valorInicial,
      margenMinimoMejoraCOP: margenMinimo,
      duracionInicialSegundos: 300, // 5 minutos de sala de subasta
      segundosRestantes: 300,
      rondaActual: 1,
      estado: 'NO_INICIADA',
      mejorLanceActual: primerLance,
      historialLances: [primerLance],
      participantes
    };
  }

  /**
   * Valida y procesa un nuevo lance emitido por un proponente
   */
  public static procesarLance(
    subasta: EstadoSubastaInversa,
    proponenteId: string,
    nuevoValor: number,
    origen: 'USUARIO' | 'COMPETIDOR_AUTOMATICO' = 'USUARIO'
  ): {
    valido: boolean;
    motivoRechazo?: string;
    subastaActualizada: EstadoSubastaInversa;
  } {
    if (subasta.estado !== 'EN_CURSO' && subasta.estado !== 'PRORROGA') {
      return { valido: false, motivoRechazo: 'La sala de subasta no se encuentra abierta para lances.', subastaActualizada: subasta };
    }

    const lider = subasta.mejorLanceActual;
    if (!lider) {
      return { valido: false, motivoRechazo: 'No existe lance de referencia inicial.', subastaActualizada: subasta };
    }

    if (nuevoValor >= lider.valorLance) {
      return {
        valido: false,
        motivoRechazo: `El lance debe ser estrictamente inferior al lance líder (\$${lider.valorLance.toLocaleString('es-CO')}).`,
        subastaActualizada: subasta
      };
    }

    const decremento = lider.valorLance - nuevoValor;
    if (decremento < subasta.margenMinimoMejoraCOP) {
      return {
        valido: false,
        motivoRechazo: `El decremento (\$${decremento.toLocaleString('es-CO')}) no cumple el margen mínimo de mejora exigido (\$${subasta.margenMinimoMejoraCOP.toLocaleString('es-CO')}).`,
        subastaActualizada: subasta
      };
    }

    const participante = subasta.participantes.find((p) => p.id === proponenteId);
    if (!participante) {
      return { valido: false, motivoRechazo: 'Proponente no habilitado en esta subasta.', subastaActualizada: subasta };
    }

    // Calcular si entra en prórroga automática (menos de 60 segundos restantes según práctica CCE)
    let nuevosSegundos = subasta.segundosRestantes;
    let nuevoEstado = subasta.estado;
    if (subasta.segundosRestantes < 60) {
      nuevosSegundos += 120; // 2 minutos adicionales de prórroga
      nuevoEstado = 'PRORROGA';
    }

    const nuevoLance: LanceSubasta = {
      id: `LANCE-${Date.now().toString().slice(-6)}`,
      tiempoSegundosRestantes: nuevosSegundos,
      horaRegistro: new Date().toLocaleTimeString(),
      proponenteId,
      nombreProponente: participante.nombre,
      valorLance: nuevoValor,
      decrementoAbsoluto: decremento,
      decrementoPct: Number(((decremento / lider.valorLance) * 100).toFixed(2)),
      esLanceLider: true,
      origen
    };

    // Actualizar historial marcando los anteriores como no líderes
    const historialActualizado = subasta.historialLances.map((l) => ({
      ...l,
      esLanceLider: false
    }));
    historialActualizado.unshift(nuevoLance);

    // Actualizar valor actual del participante
    const participantesActualizados = subasta.participantes.map((p) =>
      p.id === proponenteId ? { ...p, valorActual: nuevoValor } : p
    );

    const subastaActualizada: EstadoSubastaInversa = {
      ...subasta,
      segundosRestantes: nuevosSegundos,
      estado: nuevoEstado,
      mejorLanceActual: nuevoLance,
      historialLances: historialActualizado,
      participantes: participantesActualizados
    };

    return { valido: true, subastaActualizada };
  }

  /**
   * Evalúa si los competidores automatizados deciden responder con una contraoferta
   */
  public static simularTurnoCompetidores(
    subasta: EstadoSubastaInversa
  ): EstadoSubastaInversa {
    if (subasta.estado !== 'EN_CURSO' && subasta.estado !== 'PRORROGA') {
      return subasta;
    }

    const lider = subasta.mejorLanceActual;
    if (!lider) return subasta;

    // Filtrar competidores que no sean el líder actual y tengan margen para mejorar
    const candidatos = subasta.participantes.filter(
      (p) =>
        p.id !== lider.proponenteId &&
        p.id !== 'PROV-04' && // No simular al usuario
        p.activo &&
        p.precioReservaMinimo < lider.valorLance - subasta.margenMinimoMejoraCOP
    );

    if (candidatos.length === 0) return subasta;

    // Probabilidad de respuesta según agresividad
    const competidorElegido = candidatos[Math.floor(Math.random() * candidatos.length)];
    const factorAgresividad =
      competidorElegido.agresividad === 'AGRESIVO' ? 0.75 : competidorElegido.agresividad === 'MODERADO' ? 0.5 : 0.25;

    if (Math.random() > factorAgresividad) {
      return subasta; // En este segundo el bot no lanza
    }

    // Calcular valor del lance: decremento entre 1x y 2.5x el margen mínimo
    const factorDecremento = 1 + Math.random() * 1.5;
    const decrementoPropuesto = Math.round(subasta.margenMinimoMejoraCOP * factorDecremento);
    let valorNuevo = lider.valorLance - decrementoPropuesto;

    if (valorNuevo < competidorElegido.precioReservaMinimo) {
      valorNuevo = competidorElegido.precioReservaMinimo;
    }

    if (lider.valorLance - valorNuevo < subasta.margenMinimoMejoraCOP) {
      return subasta; // No alcanza el margen
    }

    const res = this.procesarLance(subasta, competidorElegido.id, valorNuevo, 'COMPETIDOR_AUTOMATICO');
    return res.valido ? res.subastaActualizada : subasta;
  }
}
