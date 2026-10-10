import { EditorialDocument, EditorialPalette } from '../types/editorial';

export const EDITORIAL_PALETTES: EditorialPalette[] = [
  {
    id: 'oxford-gold',
    name: 'Azul Noche & Dorado Suave',
    description: 'Papel alabastro cálido (#FBF9F5), tinta carbón antiguo, azul noche profundo (#1E3A8A) y dorado bronce (#78350F).',
    paperBg: '#FBF9F5',
    secondarySurface: '#F3EFE6',
    inkPrimary: '#1C1917',
    inkSecondary: '#44403C',
    inkMuted: '#78716C',
    borderHairline: '#E5DEC9',
    accentPrimary: '#1E3A8A',
    accentSecondary: '#78350F',
    chapterPlateBg: '#111C38',
    chapterPlateText: '#FBF9F5',
  },
  {
    id: 'Warm-terracotta',
    name: 'Piedra Caliza & Terracota Curatorial',
    description: 'Superficie pergamino suave (#F7F4EE), gris pizarra cálido y acentos en terracota académico (#9A3412).',
    paperBg: '#F7F4EE',
    secondarySurface: '#EBE6DF',
    inkPrimary: '#1C1917',
    inkSecondary: '#44403C',
    inkMuted: '#78716C',
    borderHairline: '#D6CEBE',
    accentPrimary: '#9A3412',
    accentSecondary: '#1E3A8A',
    chapterPlateBg: '#29201B',
    chapterPlateText: '#F7F4EE',
  },
  {
    id: 'slate-monograph',
    name: 'Gris Pizarra & Galería Contemporánea',
    description: 'Blanco archivo puro (#FFFFFF), divisores gris susurro, tinta negra profunda y azul pizarra institucional.',
    paperBg: '#FFFFFF',
    secondarySurface: '#F5F5F4',
    inkPrimary: '#0A0A0A',
    inkSecondary: '#404040',
    inkMuted: '#737373',
    borderHairline: '#E5E5E5',
    accentPrimary: '#1E293B',
    accentSecondary: '#9A3412',
    chapterPlateBg: '#0F172A',
    chapterPlateText: '#F8FAFC',
  },
];

export const SAMPLE_EDITORIAL_DOCUMENT: EditorialDocument = {
  title: 'Fundamentos de Macroeconomía Institucional y Arquitectura Monetaria',
  subtitle: 'Un análisis estructural sobre la estabilidad de precios, la transmisión crediticia y el equilibrio fiscal en economías complejas',
  collectionName: 'COLECCIÓN MAGISTRAL DE ESTUDIOS ECONÓMICOS · VOLUMEN XIV',
  editionMeta: 'Edición de Estudio de Lujo · Maquetación Íntegra Sin Alteración Textual',
  blocks: [
    {
      id: 'blk-1',
      type: 'chapter-opener',
      indexLabel: 'CAPÍTULO I',
      kicker: 'TEORÍA MONETARIA Y EQUILIBRIO DE LARGO PLAZO',
      content: 'La Arquitectura del Valor y la Transmisión Monetaria en el Siglo XXI',
      secondaryContent:
        'El estudio de las instituciones monetarias contemporáneas exige comprender no solo los agregados cuantitativos de liquidez, sino también la estructura de incentivos, la credibilidad de los bancos centrales y los mecanismos mediante los cuales las tasas de referencia configuran el horizonte de inversión real.',
    },
    {
      id: 'blk-2',
      type: 'paragraph',
      dropCap: true,
      content:
        'Durante las últimas cuatro décadas, la convergencia entre la teoría macroeconómica neoclásica y el institucionalismo histórico ha transformado radicalmente la comprensión de los ciclos financieros. Lejos de operar en un vacío libre de fricciones, la política monetaria transmite sus impulsos a través de una densa red de balances bancarios, expectativas salariales y contratos de deuda soberana que condicionan la velocidad de ajuste de los precios relativos.',
      marginNote: {
        id: 'mn-1',
        referenceIndex: 'Nota Marginal 1.1',
        label: 'Fricciones de Transmisión',
        text: 'El canal del crédito bancario amplifica las variaciones de tipos de interés cuando los intermediarios enfrentan restricciones de capital regulatorio.',
      },
    },
    {
      id: 'blk-3',
      type: 'key-concept',
      indexLabel: 'CONCEPTO CLAVE 01',
      kicker: 'DEFINICIÓN ESTRUCTURAL',
      content: 'Neutralidad Monetaria Condicionada y Rigidez Nominal',
      secondaryContent:
        'Principio según el cual las variaciones en la oferta monetaria nominal no alteran las variables reales (producción, empleo y tasa de interés real) en el largo plazo, siempre que el régimen fiscal mantenga su solvencia intertemporal y no existan efectos de histéresis severos en la capacidad instalada.',
      bulletPoints: [
        'Corto plazo: Los precios y salarios nominales presentan rigideces contractuales que otorgan eficacia real a los impulsos monetarios.',
        'Mediano plazo: Las expectativas de inflación se recalibran en función de la credibilidad del objetivo explícito del banco central.',
        'Largo plazo: El crecimiento potencial queda determinado por la productividad total de los factores, el capital humano y la calidad institucional.',
      ],
    },
    {
      id: 'blk-4',
      type: 'section-heading',
      indexLabel: 'SECCIÓN 1.1',
      content: 'Mecanismos de Transmisión y la Estructura Temporal de las Tasas de Interés',
    },
    {
      id: 'blk-5',
      type: 'paragraph',
      content:
        'Cuando la autoridad monetaria modifica la tasa de interés de corto plazo en el mercado interbancario, el efecto inmediato sobre el consumo agregado y la formación bruta de capital fijo depende de cómo se traslada dicho movimiento a lo largo de toda la curva de rendimientos. Las decisiones empresariales de inversión en infraestructura o investigación no responden a la tasa overnight, sino al costo real del capital a cinco, diez y veinte años.',
      marginNote: {
        id: 'mn-2',
        referenceIndex: 'Nota Marginal 1.2',
        label: 'Curva de Rendimientos',
        text: 'La pendiente entre el bono a 2 años y el bono a 10 años actúa históricamente como el indicador adelantado más robusto de desaceleración cíclica.',
      },
    },
    {
      id: 'blk-6',
      type: 'callout',
      indexLabel: 'LLAMADA DE ATENCIÓN · OBSERVACIÓN EMPÍRICA',
      kicker: 'ADVERTENCIA METODOLÓGICA PARA EL ESTUDIANTE',
      content: 'Distinción crítica entre tasas de interés nominales y tasas reales ex-ante',
      secondaryContent:
        'Un error frecuente en el análisis coyuntural consiste en interpretar una tasa de política monetaria nominal elevada como señal inequívoca de restricción monetaria. Según la identidad de Fisher, la postura restrictiva o expansiva solo puede evaluarse descontando las expectativas de inflación a doce meses vista (r = i − πe).',
    },
    {
      id: 'blk-7',
      type: 'infographic',
      content: 'Arquitectura Secuencial del Mecanismo de Transmisión Monetaria',
      infographicData: {
        kicker: 'INFOGRAFÍA CONCEPTUAL 1.1 · ESQUEMA DE FLUJO',
        title: 'De la Tasa de Referencia a la Dinámica de Precios Agregados',
        visualSuggestion:
          'Sugerencia visual para InDesign/Canva: Diagrama horizontal de 4 columnas conectadas por líneas finas de 0.5pt en color dorado suave (#78350F), con numeración en serif cursiva grande y cajas de fondo alabastro.',
        nodes: [
          {
            step: 'FASE I',
            title: 'Impulso de Política',
            detail: 'Ajuste en la tasa de intervención interbancaria y operaciones de mercado abierto.',
            metric: 'Lag: Inmediato (0–5 días)',
          },
          {
            step: 'FASE II',
            title: 'Mercados Financieros',
            detail: 'Revalorización de la curva soberana, tipo de cambio nominal y primas de riesgo corporativo.',
            metric: 'Lag: 1 a 3 meses',
          },
          {
            step: 'FASE III',
            title: 'Demanda Agregada',
            detail: 'Modulación del crédito hipotecario, inversión en bienes duraderos y gasto de capital.',
            metric: 'Lag: 6 a 12 meses',
          },
          {
            step: 'FASE IV',
            title: 'Estabilidad de Precios',
            detail: 'Cierre de la brecha del producto y convergencia de la inflación subyacente hacia la meta.',
            metric: 'Lag: 12 a 24 meses',
          },
        ],
      },
    },
    {
      id: 'blk-8',
      type: 'pull-quote',
      kicker: 'AXIOMA DE ESTABILIDAD MONETARIA',
      content:
        '«La credibilidad de una institución emisora no se construye mediante la magnitud de sus intervenciones discrecionales, sino mediante la previsibilidad inquebrantable de su regla de decisión frente a perturbaciones asimétricas.»',
    },
    {
      id: 'blk-9',
      type: 'section-heading',
      indexLabel: 'SECCIÓN 1.2',
      content: 'Evidencia Comparada de Regímenes Monetarios y Volatilidad Macroeconómica',
    },
    {
      id: 'blk-10',
      type: 'paragraph',
      content:
        'El análisis empírico de las economías avanzadas y emergentes que adoptaron esquemas explícitos de metas de inflación demuestra una reducción sustancial tanto en la persistencia inflacionaria como en la volatilidad del producto interno bruto. La tabla siguiente sintetiza los parámetros estructurales observados en cuatro configuraciones institucionales representativas.',
    },
    {
      id: 'blk-11',
      type: 'data-table',
      content: 'Tabla 1.1 — Parámetros Comparativos de Regímenes de Estabilidad Monetaria (1995–2025)',
      tableData: {
        caption: 'Tabla 1.1 · Comparativa de desempeño macroeconómico según el ancla nominal adoptada.',
        source: 'Fuente: Compilación académica basada en series históricas de bancos centrales y estadísticas del FMI.',
        headers: [
          'Régimen Monetario',
          'Inflación Media (%)',
          'Volatilidad PIB (σ)',
          'Prima Plazo (pb)',
          'Anclaje Expectativas',
        ],
        rows: [
          ['Metas de Inflación Flexibles', '2.14 %', '1.42 %', '68 pb', 'Alto (Coef. 0.89)'],
          ['Agregados Monetarios Estrictos', '3.45 %', '2.38 %', '115 pb', 'Moderado (Coef. 0.64)'],
          ['Tipo de Cambio Fijo / Anclado', '2.80 %', '3.10 %', '142 pb', 'Condicionado a Reservas'],
          ['Discrecionalidad Sin Ancla Explícita', '7.92 %', '4.05 %', '320 pb', 'Débil (Coef. 0.31)'],
        ],
      },
    },
    {
      id: 'blk-12',
      type: 'section-summary',
      indexLabel: 'SÍNTESIS DEL CAPÍTULO I',
      kicker: 'RESUMEN EJECUTIVO DE ESTUDIO Y REPASO ACADÉMICO',
      content: 'Puntos Esenciales para el Dominio de la Unidad',
      secondaryContent:
        'Al concluir esta sección del tratado, el lector debe ser capaz de articular con precisión analítica las siguientes proposiciones fundamentales:',
      bulletPoints: [
        'La distinción entre tasas de interés nominales y reales ex-ante constituye la piedra angular para evaluar la postura efectiva de la política monetaria.',
        'Los rezagos de transmisión entre el mercado interbancario y la inflación subyacente oscilan entre 12 y 24 meses, exigiendo un enfoque prospectivo.',
        'El anclaje de las expectativas de largo plazo reduce el costo de desinflación (tasa de sacrificio) ante choques de oferta transitorios.',
        'La coordinación entre sostenibilidad fiscal y autonomía operativa del banco central previene escenarios de dominancia fiscal.',
      ],
    },
  ],
};
