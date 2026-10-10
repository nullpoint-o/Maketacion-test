import { EditorialDocument, EditorialPalette } from '../types/editorial';

/**
 * Generates a complete, self-contained HTML5 + Embedded CSS file that imitates
 * luxury printed pages / high-end academic e-books while keeping 100% of the user's text intact.
 */
export function generateStandaloneLuxuryHtml(
  doc: EditorialDocument,
  palette: EditorialPalette
): string {
  const renderBlockHtml = doc.blocks
    .map((block) => {
      switch (block.type) {
        case 'chapter-opener':
          return `
      <section class="chapter-opener">
        <div class="chapter-opener-meta">
          <span>${escapeHtml(block.indexLabel || 'CAPÍTULO I')}</span>
          <span class="sep">·</span>
          <span>${escapeHtml(block.kicker || 'APERTURA DE CAPÍTULO')}</span>
        </div>
        <h1 class="chapter-title">${escapeHtml(block.content)}</h1>
        ${
          block.secondaryContent
            ? `<p class="chapter-lead">${escapeHtml(block.secondaryContent)}</p>`
            : ''
        }
      </section>`;

        case 'section-heading':
          return `
      <div class="section-heading-wrap">
        <div class="section-index">${escapeHtml(block.indexLabel || 'SECCIÓN')}</div>
        <h2 class="section-heading">${escapeHtml(block.content)}</h2>
      </div>`;

        case 'paragraph':
          return `
      <div class="reading-row">
        <div class="prose-col">
          <p class="body-paragraph ${block.dropCap ? 'drop-cap' : ''}">${escapeHtml(
            block.content
          )}</p>
        </div>
        <aside class="margin-col">
          ${
            block.marginNote
              ? `<div class="margin-note">
                  <div class="margin-note-index">${escapeHtml(
                    block.marginNote.referenceIndex
                  )} · ${escapeHtml(block.marginNote.label)}</div>
                  <p class="margin-note-text">${escapeHtml(block.marginNote.text)}</p>
                </div>`
              : ''
          }
        </aside>
      </div>`;

        case 'callout':
          return `
      <div class="reading-row">
        <div class="prose-col">
          <aside class="callout-box">
            <div class="box-kicker">${escapeHtml(block.indexLabel || 'LLAMADA DE ATENCIÓN')} · ${escapeHtml(
            block.kicker || 'NOTA METODOLÓGICA'
          )}</div>
            <h3 class="box-title">${escapeHtml(block.content)}</h3>
            ${
              block.secondaryContent
                ? `<p class="box-body">${escapeHtml(block.secondaryContent)}</p>`
                : ''
            }
          </aside>
        </div>
        <aside class="margin-col"></aside>
      </div>`;

        case 'key-concept':
          return `
      <div class="reading-row">
        <div class="prose-col">
          <section class="key-concept-box">
            <div class="box-kicker">${escapeHtml(block.indexLabel || 'CONCEPTO CLAVE')} · ${escapeHtml(
            block.kicker || 'DEFINICIÓN FUNDAMENTAL'
          )}</div>
            <h3 class="box-title">${escapeHtml(block.content)}</h3>
            ${
              block.secondaryContent
                ? `<p class="box-body">${escapeHtml(block.secondaryContent)}</p>`
                : ''
            }
            ${
              block.bulletPoints && block.bulletPoints.length > 0
                ? `<ul class="concept-list">
                    ${block.bulletPoints
                      .map((pt) => `<li>${escapeHtml(pt)}</li>`)
                      .join('\n                    ')}
                  </ul>`
                : ''
            }
          </section>
        </div>
        <aside class="margin-col"></aside>
      </div>`;

        case 'pull-quote':
          return `
      <figure class="pull-quote-wrap">
        ${block.kicker ? `<div class="quote-kicker">${escapeHtml(block.kicker)}</div>` : ''}
        <blockquote class="pull-quote">${escapeHtml(block.content)}</blockquote>
      </figure>`;

        case 'infographic':
          if (!block.infographicData) return '';
          return `
      <section class="infographic-frame">
        <div class="box-kicker">${escapeHtml(block.infographicData.kicker)}</div>
        <h3 class="infographic-title">${escapeHtml(block.infographicData.title)}</h3>
        <div class="infographic-grid">
          ${block.infographicData.nodes
            .map(
              (node) => `
            <div class="infographic-node">
              <div class="node-step">${escapeHtml(node.step)}</div>
              <h4 class="node-title">${escapeHtml(node.title)}</h4>
              <p class="node-detail">${escapeHtml(node.detail)}</p>
              ${node.metric ? `<div class="node-metric">${escapeHtml(node.metric)}</div>` : ''}
            </div>`
            )
            .join('')}
        </div>
        <div class="infographic-suggestion">${escapeHtml(
          block.infographicData.visualSuggestion
        )}</div>
      </section>`;

        case 'data-table':
          if (!block.tableData) return '';
          return `
      <figure class="table-wrap">
        <figcaption class="table-caption">${escapeHtml(block.content)}</figcaption>
        <table class="editorial-table">
          <thead>
            <tr>
              ${block.tableData.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${block.tableData.rows
              .map(
                (row) => `
            <tr>
              ${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}
            </tr>`
              )
              .join('')}
          </tbody>
        </table>
        ${
          block.tableData.source
            ? `<div class="table-source">${escapeHtml(block.tableData.source)}</div>`
            : ''
        }
      </figure>`;

        case 'section-summary':
          return `
      <section class="summary-plate">
        <div class="box-kicker">${escapeHtml(block.indexLabel || 'RESUMEN DE SECCIÓN')} · ${escapeHtml(
            block.kicker || 'SÍNTESIS ACADÉMICA'
          )}</div>
        <h3 class="summary-title">${escapeHtml(block.content)}</h3>
        ${
          block.secondaryContent
            ? `<p class="summary-lead">${escapeHtml(block.secondaryContent)}</p>`
            : ''
        }
        ${
          block.bulletPoints && block.bulletPoints.length > 0
            ? `<ol class="summary-list">
                ${block.bulletPoints
                  .map(
                    (pt, idx) =>
                      `<li><span class="summary-num">0${idx + 1}</span><span>${escapeHtml(
                        pt
                      )}</span></li>`
                  )
                  .join('\n                ')}
              </ol>`
            : ''
        }
      </section>`;

        default:
          return '';
      }
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(doc.title)} — Edición de Lujo</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --paper-bg: ${palette.paperBg};
      --surface-sec: ${palette.secondarySurface};
      --ink-primary: ${palette.inkPrimary};
      --ink-sec: ${palette.inkSecondary};
      --ink-muted: ${palette.inkMuted};
      --border-hairline: ${palette.borderHairline};
      --accent-primary: ${palette.accentPrimary};
      --accent-sec: ${palette.accentSecondary};
      --plate-bg: ${palette.chapterPlateBg};
      --plate-text: ${palette.chapterPlateText};
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #E7E2D8;
      color: var(--ink-primary);
      font-family: 'Source Serif 4', Georgia, serif;
      line-height: 1.78;
      padding: 3rem 1.5rem;
      -webkit-font-smoothing: antialiased;
    }

    .book-sheet {
      max-width: 1120px;
      margin: 0 auto;
      background-color: var(--paper-bg);
      border: 1px solid var(--border-hairline);
      padding: 5rem 4.5rem;
      box-shadow: 0 24px 60px rgba(20, 18, 15, 0.08);
    }

    .running-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-hairline);
      padding-bottom: 1rem;
      margin-bottom: 3.5rem;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.72rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--ink-muted);
    }

    .chapter-opener {
      background-color: var(--plate-bg);
      color: var(--plate-text);
      padding: 4rem 3.5rem;
      margin-bottom: 4rem;
      border: 1px solid var(--border-hairline);
    }

    .chapter-opener-meta {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.75rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      opacity: 0.8;
      margin-bottom: 1.25rem;
    }

    .chapter-opener-meta .sep {
      margin: 0 0.6rem;
    }

    .chapter-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 3rem;
      font-weight: 600;
      line-height: 1.12;
      margin-bottom: 1.5rem;
      text-wrap: balance;
    }

    .chapter-lead {
      font-family: 'Source Serif 4', Georgia, serif;
      font-size: 1.1rem;
      line-height: 1.7;
      opacity: 0.9;
      max-width: 68ch;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      padding-top: 1.25rem;
    }

    .reading-row {
      display: grid;
      grid-template-columns: minmax(0, 68%) minmax(0, 28%);
      gap: 4%;
      align-items: start;
      margin-bottom: 1.75rem;
    }

    .body-paragraph {
      font-size: 1.0625rem;
      line-height: 1.82;
      color: var(--ink-primary);
      text-align: justify;
      hyphens: auto;
    }

    .drop-cap::first-letter {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 4.1rem;
      font-weight: 700;
      float: left;
      line-height: 0.82;
      margin-right: 0.75rem;
      margin-top: 0.25rem;
      color: var(--accent-primary);
    }

    .margin-note {
      border-top: 1px solid var(--border-hairline);
      padding-top: 0.75rem;
      font-size: 0.82rem;
      line-height: 1.55;
      color: var(--ink-Muted);
    }

    .margin-note-index {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.68rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--accent-sec);
      margin-bottom: 0.35rem;
    }

    .section-heading-wrap {
      margin: 3.25rem 0 1.5rem 0;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-hairline);
      max-width: 68%;
    }

    .section-index {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--accent-primary);
      margin-bottom: 0.35rem;
    }

    .section-heading {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.95rem;
      font-weight: 600;
      line-height: 1.2;
      color: var(--ink-primary);
      text-wrap: balance;
    }

    .callout-box, .key-concept-box {
      background-color: var(--surface-sec);
      border: 1px solid var(--border-hairline);
      padding: 2rem 2.25rem;
      margin: 1.5rem 0;
    }

    .box-kicker {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent-sec);
      margin-bottom: 0.5rem;
    }

    .box-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--ink-primary);
      margin-bottom: 0.65rem;
    }

    .box-body {
      font-size: 0.98rem;
      color: var(--ink-sec);
      line-height: 1.7;
    }

    .concept-list {
      margin-top: 1rem;
      padding-left: 1.25rem;
      color: var(--ink-sec);
      font-size: 0.95rem;
    }

    .concept-list li {
      margin-bottom: 0.5rem;
    }

    .pull-quote-wrap {
      margin: 3.5rem 0;
      padding: 2.5rem 3rem;
      border-top: 1px solid var(--border-hairline);
      border-bottom: 1px solid var(--border-hairline);
      text-align: center;
    }

    .quote-kicker {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.7rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--accent-sec);
      margin-bottom: 0.85rem;
    }

    .pull-quote {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.85rem;
      font-style: italic;
      line-height: 1.38;
      color: var(--ink-primary);
      max-width: 58ch;
      margin: 0 auto;
    }

    .infographic-frame {
      margin: 3.5rem 0;
      padding: 2.5rem;
      border: 1px solid var(--border-hairline);
      background-color: var(--surface-sec);
    }

    .infographic-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.75rem;
      font-weight: 600;
      margin-bottom: 1.75rem;
    }

    .infographic-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
    }

    .infographic-node {
      background-color: var(--paper-bg);
      border: 1px solid var(--border-hairline);
      padding: 1.35rem;
    }

    .node-step {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      color: var(--accent-primary);
      margin-bottom: 0.4rem;
    }

    .node-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.45rem;
    }

    .node-detail {
      font-size: 0.88rem;
      line-height: 1.55;
      color: var(--ink-sec);
    }

    .node-metric {
      margin-top: 0.75rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-hairline);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: var(--accent-sec);
    }

    .infographic-suggestion {
      margin-top: 1.25rem;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.75rem;
      color: var(--ink-muted);
    }

    .table-wrap {
      margin: 3rem 0;
    }

    .table-caption {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.35rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .editorial-table {
      width: 100%;
      border-collapse: collapse;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.86rem;
      font-variant-numeric: tabular-nums;
    }

    .editorial-table th {
      text-align: left;
      padding: 0.85rem 1rem;
      border-top: 1px solid var(--ink-primary);
      border-bottom: 1px solid var(--ink-primary);
      font-size: 0.74rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ink-sec);
    }

    .editorial-table td {
      padding: 0.85rem 1rem;
      border-bottom: 1px solid var(--border-hairline);
      color: var(--ink-primary);
    }

    .table-source {
      margin-top: 0.65rem;
      font-size: 0.78rem;
      font-style: italic;
      color: var(--ink-muted);
    }

    .summary-plate {
      margin: 3.5rem 0 1.5rem 0;
      padding: 2.5rem 3rem;
      border: 1px solid var(--border-hairline);
      background-color: var(--surface-sec);
    }

    .summary-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .summary-lead {
      font-size: 0.98rem;
      color: var(--ink-sec);
      margin-bottom: 1.25rem;
    }

    .summary-list {
      list-style: none;
    }

    .summary-list li {
      display: flex;
      gap: 1rem;
      padding: 0.75rem 0;
      border-top: 1px solid var(--border-hairline);
      font-size: 0.95rem;
    }

    .summary-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: var(--accent-primary);
      font-weight: 600;
    }

    @media print {
      body {
        background: none;
        padding: 0;
      }
      .book-sheet {
        box-shadow: none;
        border: none;
        padding: 1.5cm;
      }
    }
  </style>
</head>
<body>
  <article class="book-sheet">
    <header class="running-header">
      <span>${escapeHtml(doc.collectionName)}</span>
      <span>FOLIO ACADÉMICO · EDICIÓN IMPRESA</span>
    </header>
    ${renderBlockHtml}
  </article>
</body>
</html>`;
}

/**
 * Generates an exhaustive, step-by-step Technical Specification Blueprint for Adobe InDesign & Canva Pro.
 */
export function generateInDesignTechnicalGuide(
  doc: EditorialDocument,
  palette: EditorialPalette
): string {
  return `# MANUAL TÉCNICO DE MAQUETACIÓN EDITORIAL (ADOBE INDESIGN & CANVA PRO)
================================================================================
OBRA: ${doc.title}
ESTILO VISUAL: Publicación Académica de Lujo / "Libro de Estudio Caro"
INTEGRIDAD TEXTUAL: 100% Contenido Original Conservado (Cero Modificaciones)

--------------------------------------------------------------------------------
1. FORMATO DE PLIEGO, CAJA TIPOGRÁFICA Y MÁRGENES (RETÍCULA ASIMÉTRICA)
--------------------------------------------------------------------------------
• Tamaño de Página Recomendado:
  - Formato Europeo Académico (Crown Quarto): 189 mm × 246 mm (o A4: 210 × 297 mm)
  - Orientación: Vertical, Páginas Opuestas (Facing Pages activado en InDesign)
• Configuración de Márgenes (Proporción Áurea / Canon de Van de Graaf):
  - Margen Superior (Cabeza): 24 mm
  - Margen Inferior (Pie): 32 mm (generosa respiración visual inferior)
  - Margen Interior (Lomo / Medianil de encuadernación): 26 mm
  - Margen Exterior (Corte + Riel de Notas Marginales): 54 mm (incluye columna lateral de 38 mm para notas al margen)
• Retícula Base (Baseline Grid):
  - Incremento cada: 14 pt (Iniciando a 24 mm desde el borde superior de página)
• Sangrado (Bleed) para Imprenta:
  - 3 mm en los 4 lados exteriores para portadillas de capítulo a sangre.

--------------------------------------------------------------------------------
2. PALETA CROMÁTICA EDITORIAL (VALORES HEX Y EQUIVALENCIA CMYK DE IMPRENTA)
--------------------------------------------------------------------------------
• Papel Base / Fondo de Pliego (${palette.name}):
  - HEX: ${palette.paperBg} | CMYK aprox.: C:2% M:3% Y:6% K:0% (Papel Ahuesado / Alabastro 115 g/m²)
• Superficie Secundaria (Cajas de Conceptos Clave y Llamadas):
  - HEX: ${palette.secondarySurface} | CMYK aprox.: C:5% M:6% Y:11% K:1%
• Tinta Principal (Cuerpo de Texto):
  - HEX: ${palette.inkPrimary} | CMYK: C:65% M:60% Y:65% K:82% (Carbón Antiguo Profundo)
• Acento Primario (Numeración, Capitulares y Títulos de Sección):
  - HEX: ${palette.accentPrimary} | Azul Noche / Terracota Curatorial
• Acento Secundario (Filetes, Kickers y Notas Marginales):
  - HEX: ${palette.accentSecondary} | Dorado Suave / Bronce Académico
• Portadilla de Capítulo (Fondo de Placa de Apertura):
  - HEX: ${palette.chapterPlateBg} con texto en ${palette.chapterPlateText}

--------------------------------------------------------------------------------
3. JERARQUÍA TIPOGRÁFICA Y ESTILOS DE PÁRRAFO (ESPECIFICACIONES EXACTAS)
--------------------------------------------------------------------------------
[A] PORTADILLA DE CAPÍTULO (Estilo: "01_Capitulo_Titulo")
    • Familia: Cormorant Garamond SemiBold (o Garamond Premier Pro Display)
    • Tamaño: 34 pt | Interlineado (Leading): 38 pt | Tracking: -10 (-0.01 em)
    • Kicker Superior ("CAPÍTULO I"): Plus Jakarta Sans SemiBold, 8.5 pt, Todo Mayúsculas, Tracking +180.

[B] TÍTULO DE SECCIÓN H2 (Estilo: "02_Seccion_Titular")
    • Familia: Cormorant Garamond SemiBold
    • Tamaño: 21 pt | Interlineado: 25 pt | Espacio anterior: 18 mm | Espacio posterior: 6 mm
    • Filete Inferior (Paragraph Rule Below): Grosor 0.5 pt, Color ${palette.borderHairline}, Desplazamiento 4 mm.

[C] CUERPO DE TEXTO GENERAL (Estilo: "03_Cuerpo_Prosa")
    • Familia: Source Serif 4 Regular (o Minion Pro / Adobe Garamond Pro)
    • Tamaño: 10.5 pt | Interlineado: 15.5 pt (alineado a cuadrícula base)
    • Alineación: Justificado con última línea a la izquierda (Left Justify)
    • Medida de columna: 65 a 72 caracteres por línea (aprox. 105 mm de ancho)
    • Capitular (Drop Cap en primer párrafo tras portadilla): 3 líneas de alto, fuente Cormorant Garamond Bold en color ${palette.accentPrimary}.

[D] NOTAS AL MARGEN (Estilo: "04_Nota_Marginal")
    • Ubicación: Marco de texto secundario en el margen exterior (ancho 38 mm, medianil 6 mm respecto al cuerpo)
    • Familia: Source Serif 4 Regular, 8.5 pt | Interlineado: 11.5 pt | Color: ${palette.inkMuted}
    • Encabezado de Nota: Plus Jakarta Sans SemiBold, 7 pt, Mayúsculas, Tracking +120, Color ${palette.accentSecondary}.

[E] RECUADROS DE "CONCEPTO CLAVE" Y "CAJAS DE LLAMADA" (Callouts)
    • Contenedor: Relleno ${palette.secondarySurface}, Contorno (Stroke) 0.5 pt sólido en todos los lados (${palette.borderHairline}). Prohibido usar bordes gruesos laterales.
    • Margen interno del marco (Text Frame Inset): Superior/Inferior 7 mm, Izquierda/Derecha 8 mm.
    • Título del Recuadro: Cormorant Garamond SemiBold, 15 pt / 18 pt.
    • Texto del Recuadro: Source Serif 4 Regular, 9.5 pt / 14 pt.

[F] TABLAS DE DATOS MODERNAS Y ACADÉMICAS
    • Encabezado de Tabla: Plus Jakarta Sans SemiBold, 8 pt, Mayúsculas, Tracking +80. Filete superior e inferior de 0.75 pt (${palette.inkPrimary}). Sin bordes verticales.
    • Celdas de Datos: Plus Jakarta Sans Regular (o JetBrains Mono para cifras), 8.5 pt, Números Tabulares activados (OpenType Tabular Lining). Filete horizontal inferior de 0.35 pt (${palette.borderHairline}).

--------------------------------------------------------------------------------
4. GUÍA DE MAQUETACIÓN BLOQUE POR BLOQUE DEL DOCUMENTO ACTUAL
--------------------------------------------------------------------------------
${doc.blocks
  .map((b, index) => {
    return `[BLOQUE ${String(index + 1).padStart(2, '0')}] TIPO: ${b.type.toUpperCase()}
  • Etiqueta / Índice: ${b.indexLabel || 'N/A'} ${b.kicker ? `· ${b.kicker}` : ''}
  • Contenido Original Íntegro: "${b.content}"
  ${b.secondaryContent ? `• Texto Secundario: "${b.secondaryContent}"` : ''}
  ${
    b.marginNote
      ? `• Nota al Margen Asociada (${b.marginNote.referenceIndex}): "${b.marginNote.text}"`
      : ''
  }`;
  })
  .join('\n\n')}
`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates a 100% standalone, zero-dependency interactive "index.html" studio
 * that can be double-clicked locally (`file://`) or uploaded directly to GitHub Pages
 * without needing `npm run build` or Node.js.
 */
export function generateStandaloneInteractiveWebApp(
  doc: EditorialDocument,
  palette: EditorialPalette
): string {
  const baseBookHtml = generateStandaloneLuxuryHtml(doc, palette);
  // Inject an interactive floating toolbar at the top of the standalone HTML so the user can switch palettes, edit text, or print when opening index.html directly
  const interactiveToolbar = `
  <style>
    .standalone-bar {
      max-width: 1120px;
      margin: 0 auto 1.5rem auto;
      background: #111C38;
      color: #FBF9F5;
      padding: 0.9rem 1.5rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.78rem;
      border: 1px solid rgba(255,255,255,0.15);
    }
    .standalone-bar-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      align-items: center;
    }
    .standalone-btn {
      background: rgba(255,255,255,0.1);
      color: #FFFFFF;
      border: 1px solid rgba(255,255,255,0.25);
      padding: 0.45rem 0.85rem;
      font-size: 0.72rem;
      font-family: 'Plus Jakarta Sans', sans-serif;
      cursor: pointer;
      letter-spacing: 0.04em;
    }
    .standalone-btn:hover {
      background: rgba(255,255,255,0.22);
    }
    .standalone-btn-primary {
      background: #78350F;
      border-color: #9A3412;
    }
    @media print {
      .standalone-bar { display: none !important; }
    }
  </style>
  <div class="standalone-bar">
    <div>
      <strong>ATELIER FOLIO · ARCHIVO HTML AUTÓNOMO</strong>
      <span style="opacity:0.75; margin-left: 0.5rem;">(Funciona con doble clic local y en GitHub Pages sin servidor)</span>
    </div>
    <div class="standalone-bar-actions">
      <button class="standalone-btn" onclick="setTheme('#FBF9F5','#F3EFE6','#1E3A8A','#78350F','#111C38')">Azul Noche &amp; Dorado</button>
      <button class="standalone-btn" onclick="setTheme('#F7F4EE','#EBE6DF','#9A3412','#1E3A8A','#29201B')">Piedra &amp; Terracota</button>
      <button class="standalone-btn" onclick="setTheme('#FFFFFF','#F5F5F4','#1E293B','#9A3412','#0F172A')">Gris Pizarra</button>
      <button class="standalone-btn" onclick="toggleEditable()" id="editBtn">Activar Edición Directa</button>
      <button class="standalone-btn standalone-btn-primary" onclick="window.print()">Imprimir / Guardar PDF</button>
    </div>
  </div>
  <script>
    function setTheme(paper, sec, acc1, acc2, plate) {
      const r = document.documentElement.style;
      r.setProperty('--paper-bg', paper);
      r.setProperty('--surface-sec', sec);
      r.setProperty('--accent-primary', acc1);
      r.setProperty('--accent-sec', acc2);
      r.setProperty('--plate-bg', plate);
    }
    let isEdit = false;
    function toggleEditable() {
      isEdit = !isEdit;
      const sheet = document.querySelector('.book-sheet');
      if (sheet) {
        sheet.contentEditable = isEdit ? 'true' : 'false';
        sheet.style.outline = isEdit ? '2px dashed #1E3A8A' : 'none';
      }
      const btn = document.getElementById('editBtn');
      if (btn) btn.textContent = isEdit ? 'Bloquear Edición' : 'Activar Edición Directa';
    }
  </script>
`;

  return baseBookHtml.replace('<body>', `<body>\n${interactiveToolbar}`);
}

