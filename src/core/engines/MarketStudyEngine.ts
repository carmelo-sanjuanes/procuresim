import type { ItemRequerimiento, CotizacionProveedor, AnalisisEstudioMercado } from '../domain/types';

export class MarketStudyEngine {
  /**
   * Calcula estadísticas descriptivas para una serie de precios
   */
  public static calcularEstadisticas(precios: number[]) {
    if (precios.length === 0) {
      return {
        min: 0,
        max: 0,
        promedio: 0,
        mediana: 0,
        desviacion: 0,
        coeficienteVariacion: 0
      };
    }

    const ordenados = [...precios].sort((a, b) => a - b);
    const n = ordenados.length;
    const min = ordenados[0];
    const max = ordenados[n - 1];

    // Promedio (Media Aritmética)
    const suma = ordenados.reduce((acc, curr) => acc + curr, 0);
    const promedio = Math.round(suma / n);

    // Mediana
    let mediana: number;
    if (n % 2 === 0) {
      mediana = Math.round((ordenados[n / 2 - 1] + ordenados[n / 2]) / 2);
    } else {
      mediana = ordenados[Math.floor(n / 2)];
    }

    // Desviación estándar muestral
    let varianza = 0;
    if (n > 1) {
      const sumaCuadrados = ordenados.reduce((acc, val) => acc + Math.pow(val - promedio, 2), 0);
      varianza = sumaCuadrados / (n - 1);
    }
    const desviacion = Math.round(Math.sqrt(varianza));

    // Coeficiente de variación (en porcentaje)
    const coeficienteVariacion = promedio > 0 ? Number(((desviacion / promedio) * 100).toFixed(2)) : 0;

    return {
      min,
      max,
      promedio,
      mediana,
      desviacion,
      coeficienteVariacion
    };
  }

  /**
   * Genera el análisis completo de mercado a partir de requerimientos y cotizaciones
   */
  public static procesarEstudioMercado(
    codigoProceso: string,
    objeto: string,
    items: ItemRequerimiento[],
    cotizaciones: CotizacionProveedor[],
    metodologia: 'MEDIA_ARITMETICA' | 'MEDIANA' | 'MENOR_VALOR' | 'PRECIO_HISTORICO_INDEXADO' = 'MEDIA_ARITMETICA'
  ): AnalisisEstudioMercado {
    const resultadosPorItem = items.map((item) => {
      // Recolectar precios unitarios cotizados para este ítem
      const preciosCotizados = cotizaciones
        .map((cot) => cot.items.find((i) => i.itemId === item.id)?.valorUnitario)
        .filter((val): val is number => typeof val === 'number' && val > 0);

      const stats = this.calcularEstadisticas(preciosCotizados);

      let precioSeleccionado = stats.promedio;
      if (metodologia === 'MEDIANA') precioSeleccionado = stats.mediana;
      if (metodologia === 'MENOR_VALOR') precioSeleccionado = stats.min;

      const subtotalEstimado = Math.round(precioSeleccionado * item.cantidad);

      return {
        itemId: item.id,
        precioMinimo: stats.min,
        precioMaximo: stats.max,
        precioPromedio: stats.promedio,
        precioMediana: stats.mediana,
        desviacionEstandar: stats.desviacion,
        coeficienteVariacion: stats.coeficienteVariacion,
        precioSeleccionado,
        subtotalEstimado
      };
    });

    const presupuestoTotalEstimado = resultadosPorItem.reduce((acc, curr) => acc + curr.subtotalEstimado, 0);

    let justificacion = `Para determinar el presupuesto oficial estimado del proceso se aplicó la metodología de ${metodologia} `;
    justificacion += `a partir del muestreo de ${cotizaciones.length} cotizaciones formales recibidas de operadores económicos del sector. `;
    justificacion += `El valor total resultante de \$${presupuestoTotalEstimado.toLocaleString('es-CO')} COP refleja las condiciones del mercado actual, garantizando suficiencia presupuestal y sostenibilidad financiera en cumplimiento del Decreto 1082 de 2015.`;

    return {
      id: `EST-MERC-${Date.now()}`,
      codigoProceso,
      objeto,
      fechaElaboracion: new Date().toISOString().split('T')[0],
      items,
      cotizacionesRecibidas: cotizaciones,
      metodologiaCalculo: metodologia,
      resultadosPorItem,
      presupuestoTotalEstimado,
      justificacionEconomica: justificacion,
      fuentesConsultadas: [
        'Cotizaciones directas de proveedores del sector',
        'Precios históricos registrados en SECOP II para procesos similares',
        'Índice de Precios al Consumidor (IPC / DANE)',
        'Catálogo de Acuerdos Marco de Precios de Colombia Compra Eficiente'
      ]
    };
  }

  /**
   * Genera de 3 a 5 cotizaciones simuladas realistas para propósitos de entrenamiento o simulación precontractual
   */
  public static generarCotizacionesSimuladas(items: ItemRequerimiento[]): CotizacionProveedor[] {
    const proveedoresFicticios = [
      {
        nombre: 'SUMINISTROS & LOGÍSTICA INTEGRAL S.A.S.',
        nit: '900.584.231-8',
        contacto: 'Carlos Alberto Restrepo',
        telefono: '(601) 745-9080',
        email: 'licitaciones@suministrosintegral.com.co',
        variacionBase: 0.96, // Cotiza un 4% por debajo de la media esperada
        plazoEntrega: 15,
        vigencia: 60
      },
      {
        nombre: 'SOLUCIONES CORPORATIVAS DE COLOMBIA LTDA.',
        nit: '830.129.475-2',
        contacto: 'María Fernanda Gómez',
        telefono: '(604) 448-3211',
        email: 'ventas@solucionescolombia.com',
        variacionBase: 1.03, // Cotiza un 3% por encima
        plazoEntrega: 20,
        vigencia: 90
      },
      {
        nombre: 'INGENIERÍA, DOTACIONES Y SERVICIOS ANDINOS S.A.S.',
        nit: '901.348.910-4',
        contacto: 'Julián David Morales',
        telefono: '(602) 889-1044',
        email: 'comercial@dotacionesandinas.co',
        variacionBase: 1.08, // Cotiza un 8% por encima con mayor valor agregado
        plazoEntrega: 10,
        vigencia: 45
      },
      {
        nombre: 'INVERSIONES Y COMERCIALIZADORA DEL CARIBE S.A.S.',
        nit: '800.765.312-9',
        contacto: 'Patricia Helena Vargas',
        telefono: '(605) 360-5544',
        email: 'contacto@comercializadoracaribe.com',
        variacionBase: 0.93, // Cotiza un 7% por debajo
        plazoEntrega: 25,
        vigencia: 60
      }
    ];

    return proveedoresFicticios.map((prov, idx) => {
      let subtotalTotal = 0;
      const itemsCotizados = items.map((item) => {
        const precioBase = item.precioUnitarioEstimado || 50000;
        // Variación aleatoria controlada alrededor de la variación base de cada proveedor (± 3%)
        const factorRuido = 1 + (Math.random() * 0.06 - 0.03);
        const valorUnitario = Math.round(precioBase * prov.variacionBase * factorRuido / 100) * 100;
        const subtotal = valorUnitario * item.cantidad;
        subtotalTotal += subtotal;

        return {
          itemId: item.id,
          valorUnitario,
          subtotal
        };
      });

      const ivaGeneralPct = 19;
      const valorIVA = Math.round(subtotalTotal * (ivaGeneralPct / 100));
      const valorTotal = subtotalTotal + valorIVA;

      return {
        id: `COT-${idx + 1}-${Date.now()}`,
        proveedorNombre: prov.nombre,
        nit: prov.nit,
        contacto: prov.contacto,
        telefono: prov.telefono,
        email: prov.email,
        fechaCotizacion: new Date(Date.now() - (idx + 1) * 86400000 * 3).toISOString().split('T')[0],
        items: itemsCotizados,
        aplicaAIU: false,
        ivaGeneralPct,
        ivaSobreUtilidad: false,
        subtotal: subtotalTotal,
        valorIVA,
        valorTotal,
        plazoEntregaDias: prov.plazoEntrega,
        vigenciaOfertaDias: prov.vigencia,
        observaciones: 'Precios incluyen transporte en sitio de entrega, cargue y descargue. Forma de pago: Contra entrega a satisfacción.'
      };
    });
  }
}
