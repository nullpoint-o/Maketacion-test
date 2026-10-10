import * as mammoth from 'mammoth';
import { EditorialBlock, EditorialDocument } from '../types/editorial';

/**
 * Parses an uploaded .docx ArrayBuffer via Mammoth HTML conversion
 * and preserves 100% of the original Word text without modifying a single word.
 */
export async function parseDocxToEditorialDocument(
  arrayBuffer: ArrayBuffer,
  fileName: string
): Promise<EditorialDocument> {
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const bodyChildren = Array.from(doc.body.children);

  if (bodyChildren.length === 0) {
    const rawText = doc.body.textContent || '';
    return parseRawTextToEditorialDocument(rawText, fileName.replace(/\.docx$/i, ''));
  }

  let docTitle = fileName.replace(/\.docx$/i, '').replace(/[-_]/g, ' ');
  let docSubtitle = 'Edición Académica Maquetada · Contenido Original Íntegro';
  const blocks: EditorialBlock[] = [];

  let chapterCounter = 1;
  let sectionCounter = 1;
  let conceptCounter = 1;
  let noteCounter = 1;
  let tableCounter = 1;
  let infographicCounter = 1;
  let summaryCounter = 1;
  let expectDropCap = true;

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  for (let i = 0; i < bodyChildren.length; i++) {
    const el = bodyChildren[i];
    const tag = el.tagName.toLowerCase();
    const text = (el.textContent || '').trim();

    if (!text && tag !== 'table') continue;

    // First H1 can serve as main book title or Chapter Opener
    if (tag === 'h1') {
      if (i === 0 && blocks.length === 0) {
        docTitle = text;
      }
      const nextEl = bodyChildren[i + 1];
      let openerSummary = '';
      if (nextEl && nextEl.tagName.toLowerCase() === 'p' && (nextEl.textContent || '').trim().length < 260) {
        openerSummary = (nextEl.textContent || '').trim();
        i++; // consume subtitle paragraph as chapter intro lead
      }

      const roman = romanNumerals[(chapterCounter - 1) % romanNumerals.length];
      blocks.push({
        id: `blk-${blocks.length + 1}`,
        type: 'chapter-opener',
        indexLabel: `CAPÍTULO ${roman}`,
        kicker: 'APERTURA DE UNIDAD MAGISTRAL',
        content: text,
        secondaryContent: openerSummary || undefined,
      });
      chapterCounter++;
      expectDropCap = true;
      continue;
    }

    if (tag === 'h2' || tag === 'h3') {
      const lower = text.toLowerCase();
      if (lower.includes('resumen') || lower.includes('síntesis') || lower.includes('conclusión') || lower.includes('conclusiones')) {
        // Check if followed by a list or paragraph
        const nextEl = bodyChildren[i + 1];
        let bullets: string[] = [];
        let secondary = '';
        if (nextEl && (nextEl.tagName.toLowerCase() === 'ul' || nextEl.tagName.toLowerCase() === 'ol')) {
          bullets = Array.from(nextEl.querySelectorAll('li'))
            .map((li) => (li.textContent || '').trim())
            .filter(Boolean);
          i++;
        } else if (nextEl && nextEl.tagName.toLowerCase() === 'p') {
          secondary = (nextEl.textContent || '').trim();
          i++;
        }

        blocks.push({
          id: `blk-${blocks.length + 1}`,
          type: 'section-summary',
          indexLabel: `SÍNTESIS DE SECCIÓN 0${summaryCounter++}`,
          kicker: 'RESUMEN DE CONCEPTOS FUNDAMENTALES',
          content: text,
          secondaryContent: secondary || undefined,
          bulletPoints: bullets.length > 0 ? bullets : undefined,
        });
        continue;
      }

      blocks.push({
        id: `blk-${blocks.length + 1}`,
        type: 'section-heading',
        indexLabel: `SECCIÓN ${chapterCounter - 1 || 1}.${sectionCounter++}`,
        content: text,
      });
      continue;
    }

    if (tag === 'table') {
      const rows = Array.from(el.querySelectorAll('tr')).map((tr) =>
        Array.from(tr.querySelectorAll('th, td')).map((cell) => (cell.textContent || '').trim())
      ).filter((r) => r.length > 0);

      if (rows.length > 0) {
        const headers = rows[0];
        const bodyRows = rows.slice(1);
        blocks.push({
          id: `blk-${blocks.length + 1}`,
          type: 'data-table',
          content: `Tabla ${tableCounter} — Registro Estructural de Datos del Documento`,
          tableData: {
            caption: `Tabla ${tableCounter} · Datos tabulares extraídos íntegramente del manuscrito original.`,
            headers,
            rows: bodyRows.length > 0 ? bodyRows : [headers],
          },
        });
        tableCounter++;
      }
      continue;
    }

    if (tag === 'ul' || tag === 'ol') {
      const items = Array.from(el.querySelectorAll('li'))
        .map((li) => (li.textContent || '').trim())
        .filter(Boolean);

      if (items.length === 0) continue;

      // If list has 3 to 5 items with colons or structured steps, format as conceptual infographic or key concept
      const hasColons = items.filter((item) => item.includes(':')).length >= Math.min(2, items.length);
      if (hasColons && items.length >= 3 && items.length <= 6) {
        const nodes = items.map((item, idx) => {
          const [head, ...rest] = item.split(':');
          return {
            step: `ETAPA 0${idx + 1}`,
            title: head.trim(),
            detail: rest.join(':').trim() || head.trim(),
          };
        });
        blocks.push({
          id: `blk-${blocks.length + 1}`,
          type: 'infographic',
          content: `Esquema Estructural 0${infographicCounter}`,
          infographicData: {
            kicker: `INFOGRAFÍA CONCEPTUAL 0${infographicCounter} · SECUENCIA ANALÍTICA`,
            title: `Estructura Secuencial de Elementos (${items.length} Bloques)`,
            visualSuggestion:
              'Sugerencia visual para InDesign/Canva: Retícula modular de tarjetas unidas por filete fino de 0.5pt y numeración tabular en cuerpo 9pt.',
            nodes,
          },
        });
        infographicCounter++;
      } else {
        blocks.push({
          id: `blk-${blocks.length + 1}`,
          type: 'key-concept',
          indexLabel: `CONCEPTO CLAVE 0${conceptCounter++}`,
          kicker: 'PUNTOS CLAVE DEL TEXTO ORIGINAL',
          content: items[0],
          bulletPoints: items.length > 1 ? items.slice(1) : [items[0]],
        });
      }
      continue;
    }

    if (tag === 'blockquote') {
      blocks.push({
        id: `blk-${blocks.length + 1}`,
        type: 'pull-quote',
        kicker: 'CITA DESTACADA DEL MANUSCRITO',
        content: text,
      });
      continue;
    }

    // Standard paragraph analysis — never alter the text, only classify layout box if marked
    const lower = text.toLowerCase();
    if (
      lower.startsWith('nota:') ||
      lower.startsWith('importante:') ||
      lower.startsWith('atención:') ||
      lower.startsWith('advertencia:') ||
      lower.startsWith('recuerda:') ||
      lower.startsWith('observación:')
    ) {
      const [prefix, ...rest] = text.split(':');
      blocks.push({
        id: `blk-${blocks.length + 1}`,
        type: 'callout',
        indexLabel: `LLAMADA DE ATENCIÓN · ${prefix.toUpperCase()}`,
        kicker: 'RECUADRO DE ÉNFASIS EDITORIAL',
        content: prefix.trim(),
        secondaryContent: rest.join(':').trim() || text,
      });
      continue;
    }

    if (
      lower.startsWith('concepto clave') ||
      lower.startsWith('definición:') ||
      lower.startsWith('principio:') ||
      lower.startsWith('axioma:')
    ) {
      const [prefix, ...rest] = text.split(':');
      blocks.push({
        id: `blk-${blocks.length + 1}`,
        type: 'key-concept',
        indexLabel: `CONCEPTO CLAVE 0${conceptCounter++}`,
        kicker: 'DEFINICIÓN DESTACADA',
        content: prefix.trim(),
        secondaryContent: rest.join(':').trim() || text,
      });
      continue;
    }

    // Attach an automatic margin note every 2nd long paragraph using a verbatim key phrase
    let marginNote = undefined;
    if (text.length > 220 && blocks.filter((b) => b.type === 'paragraph').length % 2 === 0) {
      const firstSentence = text.split(/(?<=[.!?])\s+/)[0] || text.slice(0, 120);
      marginNote = {
        id: `mn-${noteCounter}`,
        referenceIndex: `Nota Marginal 1.${noteCounter}`,
        label: 'Apunte de Lectura',
        text: firstSentence,
      };
      noteCounter++;
    }

    blocks.push({
      id: `blk-${blocks.length + 1}`,
      type: 'paragraph',
      dropCap: expectDropCap,
      content: text,
      marginNote,
    });
    expectDropCap = false;
  }

  // Ensure there is a chapter opener if none was detected
  if (!blocks.some((b) => b.type === 'chapter-opener') && blocks.length > 0) {
    const firstBlock = blocks[0];
    if (firstBlock.type === 'paragraph' && firstBlock.content.length < 140) {
      docTitle = firstBlock.content;
      firstBlock.type = 'chapter-opener';
      firstBlock.indexLabel = 'CAPÍTULO I';
      firstBlock.kicker = 'APERTURA EDITORIAL';
    } else {
      blocks.unshift({
        id: 'blk-opener-auto',
        type: 'chapter-opener',
        indexLabel: 'CAPÍTULO I',
        kicker: 'DOCUMENTO ORIGINAL MAQUETADO',
        content: docTitle,
        secondaryContent: docSubtitle,
      });
    }
  }

  return {
    title: docTitle,
    subtitle: docSubtitle,
    collectionName: 'PUBLICACIÓN ACADÉMICA DE ALTA GAMA · TEXTO ORIGINAL ÍNTEGRO',
    editionMeta: 'Maquetación de Prestigio Internacional · Cero Alteración de Contenido',
    blocks,
  };
}

/**
 * Parses pasted raw text or Markdown from Word into our luxury editorial structure
 * without changing a single word of the user's text.
 */
export function parseRawTextToEditorialDocument(
  rawText: string,
  customTitle?: string
): EditorialDocument {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return {
      title: customTitle || 'Documento Sin Contenido',
      subtitle: 'Introduce o sube el contenido de tu documento Word para maquetarlo.',
      collectionName: 'EDICIÓN ACADÉMICA DE LUJO',
      editionMeta: 'Texto Original Íntegro',
      blocks: [],
    };
  }

  const blocks: EditorialBlock[] = [];
  let docTitle = customTitle || 'Tratado Académico y Publicación de Estudio';
  const docSubtitle = 'Maquetación Editorial de Alta Gama · Conservación Textual Absoluta';

  let chapterCount = 1;
  let sectionCount = 1;
  let conceptCount = 1;
  let noteCount = 1;
  let tableCount = 1;
  let infographicCount = 1;
  let expectDropCap = true;
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Detect pipe tables (| col1 | col2 |) or tab-separated tables from Word copy-paste
    if (line.includes('|') || (line.includes('\t') && line.split('\t').length >= 2)) {
      const separator = line.includes('|') ? '|' : '\t';
      const tableLines: string[][] = [];
      while (
        i < lines.length &&
        (lines[i].includes(separator) || (separator === '|' && lines[i].startsWith('|')))
      ) {
        const rawRow = lines[i]
          .split(separator)
          .map((c) => c.trim())
          .filter((c, idx, arr) => {
            if (separator === '|' && (idx === 0 || idx === arr.length - 1) && c === '') return false;
            return true;
          });
        // Skip markdown separator rows like |---|---|
        if (rawRow.length > 0 && !rawRow.every((cell) => /^[-:]+$/.test(cell))) {
          tableLines.push(rawRow);
        }
        i++;
      }

      if (tableLines.length >= 1) {
        blocks.push({
          id: `blk-${blocks.length + 1}`,
          type: 'data-table',
          content: `Tabla ${tableCount} — Cuadro Sinóptico y Registro de Datos`,
          tableData: {
            caption: `Tabla ${tableCount} · Estructura tabular maquetada a partir del documento original.`,
            headers: tableLines[0],
            rows: tableLines.length > 1 ? tableLines.slice(1) : [tableLines[0]],
          },
        });
        tableCount++;
        continue;
      }
    }

    // Detect bullet lists (-, *, •, 1.)
    if (/^([-*•]|\d+[.)])\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^([-*•]|\d+[.)])\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^([-*•]|\d+[.)])\s+/, '').trim());
        i++;
      }

      const hasStructuredSteps =
        listItems.length >= 3 &&
        listItems.length <= 6 &&
        listItems.filter((it) => it.includes(':')).length >= 2;

      if (hasStructuredSteps) {
        blocks.push({
          id: `blk-${blocks.length + 1}`,
          type: 'infographic',
          content: `Arquitectura Conceptual 0${infographicCount}`,
          infographicData: {
            kicker: `INFOGRAFÍA CONCEPTUAL 0${infographicCount} · PROCESO Y COMPONENTES`,
            title: 'Secuencia Estructural de Elementos Clave',
            visualSuggestion:
              'Sugerencia visual para InDesign/Canva: Composición en retícula horizontal con filetes de 0.5pt, numeración romana o tabular en dorado suave y cajas de respiración.',
            nodes: listItems.map((it, idx) => {
              const [head, ...rest] = it.split(':');
              return {
                step: `FASE 0${idx + 1}`,
                title: head.trim(),
                detail: rest.join(':').trim() || head.trim(),
              };
            }),
          },
        });
        infographicCount++;
      } else {
        blocks.push({
          id: `blk-${blocks.length + 1}`,
          type: 'key-concept',
          indexLabel: `CONCEPTO CLAVE 0${conceptCount++}`,
          kicker: 'SÍNTESIS ESTRUCTURADA DEL MANUSCRITO',
          content: listItems[0],
          bulletPoints: listItems,
        });
      }
      continue;
    }

    // Detect Chapter Headings (# Heading, CAPÍTULO, TEMA, UNIDAD, or short first line)
    const isMarkdownH1 = /^#\s+/.test(line);
    const isExplicitChapter = /^(cap[íi]tulo|unidad|tema|parte|m[óo]dulo)\s+/i.test(line);

    if (isMarkdownH1 || isExplicitChapter || (i === 0 && line.length < 120)) {
      const cleanHeading = line.replace(/^#+\s+/, '').trim();
      if (i === 0) docTitle = cleanHeading;

      const roman = romanNumerals[(chapterCount - 1) % romanNumerals.length];
      blocks.push({
        id: `blk-${blocks.length + 1}`,
        type: 'chapter-opener',
        indexLabel: `CAPÍTULO ${roman}`,
        kicker: 'PORTADILLA DE CAPÍTULO · EDICIÓN MAGISTRAL',
        content: cleanHeading,
      });
      chapterCount++;
      expectDropCap = true;
      i++;
      continue;
    }

    // Detect Section Headings (## Heading, numbered headings like 1.1, or short title lines without period)
    const isMarkdownSub = /^#{2,4}\s+/.test(line);
    const isNumberedSection = /^\d+(\.\d+)*\s+[A-ZÁÉÍÓÚÑ]/.test(line) && line.length < 110;
    const isShortHeading =
      line.length < 85 &&
      !line.endsWith('.') &&
      !line.endsWith(':') &&
      /^[A-ZÁÉÍÓÚÑ]/.test(line) &&
      i < lines.length - 1;

    if (isMarkdownSub || isNumberedSection || isShortHeading) {
      const cleanSub = line.replace(/^#+\s+/, '').trim();
      const lowerSub = cleanSub.toLowerCase();

      if (
        lowerSub.includes('resumen') ||
        lowerSub.includes('síntesis') ||
        lowerSub.includes('conclusión') ||
        lowerSub.includes('conclusiones')
      ) {
        const nextLine = lines[i + 1] || '';
        blocks.push({
          id: `blk-${blocks.length + 1}`,
          type: 'section-summary',
          indexLabel: 'RESUMEN DE SECCIÓN',
          kicker: 'SÍNTESIS FINAL PARA REPASO',
          content: cleanSub,
          secondaryContent: nextLine && nextLine.length > 40 ? nextLine : undefined,
        });
        if (nextLine && nextLine.length > 40) i += 2;
        else i++;
        continue;
      }

      blocks.push({
        id: `blk-${blocks.length + 1}`,
        type: 'section-heading',
        indexLabel: `SECCIÓN ${Math.max(1, chapterCount - 1)}.${sectionCount++}`,
        content: cleanSub,
      });
      i++;
      continue;
    }

    // Detect Callouts / Warnings / Key Concepts by prefix
    const lowerLine = line.toLowerCase();
    if (
      lowerLine.startsWith('nota:') ||
      lowerLine.startsWith('importante:') ||
      lowerLine.startsWith('llamada:') ||
      lowerLine.startsWith('atención:') ||
      lowerLine.startsWith('advertencia:') ||
      lowerLine.startsWith('observación:')
    ) {
      const [prefix, ...rest] = line.split(':');
      blocks.push({
        id: `blk-${blocks.length + 1}`,
        type: 'callout',
        indexLabel: `LLAMADA DE ATENCIÓN · ${prefix.toUpperCase()}`,
        kicker: 'CAJA DE LLAMADA EDITORIAL',
        content: prefix.trim(),
        secondaryContent: rest.join(':').trim() || line,
      });
      i++;
      continue;
    }

    if (
      lowerLine.startsWith('concepto clave') ||
      lowerLine.startsWith('definición:') ||
      lowerLine.startsWith('idea clave:') ||
      lowerLine.startsWith('principio:')
    ) {
      const [prefix, ...rest] = line.split(':');
      blocks.push({
        id: `blk-${blocks.length + 1}`,
        type: 'key-concept',
        indexLabel: `CONCEPTO CLAVE 0${conceptCount++}`,
        kicker: 'RECUADRO DE CONCEPTO FUNDAMENTAL',
        content: prefix.trim(),
        secondaryContent: rest.join(':').trim() || line,
      });
      i++;
      continue;
    }

    // Detect Pull Quotes
    if (
      (line.startsWith('«') && line.endsWith('»')) ||
      (line.startsWith('"') && line.endsWith('"')) ||
      (line.startsWith('“') && line.endsWith('”')) ||
      line.startsWith('>')
    ) {
      blocks.push({
        id: `blk-${blocks.length + 1}`,
        type: 'pull-quote',
        kicker: 'CITA DESTACADA',
        content: line.replace(/^>\s*/, ''),
      });
      i++;
      continue;
    }

    // Regular body paragraph — preserve exact wording
    let marginNote = undefined;
    const paragraphBlocksCount = blocks.filter((b) => b.type === 'paragraph').length;
    if (line.length > 200 && paragraphBlocksCount % 2 === 0) {
      const firstSentence = line.split(/(?<=[.!?])\s+/)[0] || line.slice(0, 115);
      marginNote = {
        id: `mn-${noteCount}`,
        referenceIndex: `Nota al Margen 1.${noteCount}`,
        label: 'Referencia Marginal',
        text: firstSentence,
      };
      noteCount++;
    }

    blocks.push({
      id: `blk-${blocks.length + 1}`,
      type: 'paragraph',
      dropCap: expectDropCap,
      content: line,
      marginNote,
    });
    expectDropCap = false;
    i++;
  }

  return {
    title: docTitle,
    subtitle: docSubtitle,
    collectionName: 'PUBLICACIÓN ACADÉMICA DE ALTA GAMA · TEXTO ORIGINAL ÍNTEGRO',
    editionMeta: 'Diseño Editorial de Prestigio Internacional · Sin Modificación de Contenido',
    blocks,
  };
}
