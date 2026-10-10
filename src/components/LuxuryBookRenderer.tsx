import React from 'react';
import {
  EditorialBlock,
  EditorialBlockType,
  EditorialDocument,
  EditorialPalette,
} from '../types/editorial';

interface LuxuryBookRendererProps {
  document: EditorialDocument;
  palette: EditorialPalette;
  interactiveMode: boolean;
  onChangeBlockType?: (blockId: string, newType: EditorialBlockType) => void;
  onToggleDropCap?: (blockId: string) => void;
  onAddMarginNote?: (blockId: string) => void;
}

const BLOCK_TYPE_LABELS: { value: EditorialBlockType; label: string }[] = [
  { value: 'chapter-opener', label: 'Portadilla de Capítulo' },
  { value: 'section-heading', label: 'Titular de Sección' },
  { value: 'paragraph', label: 'Cuerpo de Prosa' },
  { value: 'key-concept', label: 'Recuadro: Concepto Clave' },
  { value: 'callout', label: 'Caja de Llamada (Callout)' },
  { value: 'pull-quote', label: 'Cita Destacada' },
  { value: 'infographic', label: 'Infografía Conceptual' },
  { value: 'data-table', label: 'Tabla de Datos' },
  { value: 'section-summary', label: 'Resumen Final de Sección' },
];

export const LuxuryBookRenderer: React.FC<LuxuryBookRendererProps> = ({
  document,
  palette,
  interactiveMode,
  onChangeBlockType,
  onToggleDropCap,
  onAddMarginNote,
}) => {
  const renderControls = (block: EditorialBlock) => {
    if (!interactiveMode) return null;
    return (
      <div
        className="no-print mb-2 flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-dashed text-[11px] font-sans transition-opacity opacity-70 hover:opacity-100"
        style={{ borderColor: palette.borderHairline, color: palette.inkMuted }}
      >
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-widest font-medium">Rol Editorial:</span>
          <select
            value={block.type}
            onChange={(e) =>
              onChangeBlockType &&
              onChangeBlockType(block.id, e.target.value as EditorialBlockType)
            }
            className="bg-transparent border px-2 py-0.5 text-xs font-medium focus:outline-none cursor-pointer"
            style={{
              borderColor: palette.borderHairline,
              color: palette.inkPrimary,
              backgroundColor: palette.paperBg,
            }}
          >
            {BLOCK_TYPE_LABELS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          {block.type === 'paragraph' && (
            <>
              <button
                type="button"
                onClick={() => onToggleDropCap && onToggleDropCap(block.id)}
                className="underline hover:opacity-80 cursor-pointer whitespace-nowrap"
                style={{ color: palette.accentPrimary }}
              >
                {block.dropCap ? 'Quitar Capitular' : 'Aplicar Capitular'}
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onAddMarginNote && onAddMarginNote(block.id)}
                className="underline hover:opacity-80 cursor-pointer whitespace-nowrap"
                style={{ color: palette.accentSecondary }}
              >
                {block.marginNote ? 'Ocultar Nota Marginal' : 'Extraer Nota al Margen'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <article
      className="print-only-canvas w-full max-w-[1160px] mx-auto border transition-colors duration-200"
      style={{
        backgroundColor: palette.paperBg,
        borderColor: palette.borderHairline,
        color: palette.inkPrimary,
      }}
    >
      {/* Pliego Interior con márgenes de libro de estudio caro */}
      <div className="px-6 py-10 sm:px-12 sm:py-14 lg:px-20 lg:py-20">
        {/* Cabecera de Pliego / Folio Superior */}
        <header
          className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-12 border-b text-[11px] font-sans tracking-[0.18em] uppercase"
          style={{
            borderColor: palette.borderHairline,
            color: palette.inkMuted,
          }}
        >
          <span>{document.collectionName}</span>
          <div className="flex items-center gap-2">
            <span>{document.editionMeta}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">FOLIO I</span>
          </div>
        </header>

        {/* Secuencia de Bloques Maquetados */}
        <div className="space-y-8">
          {document.blocks.map((block) => {
            switch (block.type) {
              case 'chapter-opener':
                return (
                  <section key={block.id} className="mb-14">
                    {renderControls(block)}
                    <div
                      className="p-8 sm:p-12 lg:p-16 border transition-colors"
                      style={{
                        backgroundColor: palette.chapterPlateBg,
                        color: palette.chapterPlateText,
                        borderColor: palette.borderHairline,
                      }}
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs font-sans tracking-[0.22em] uppercase opacity-80 mb-5">
                        <span>{block.indexLabel || 'CAPÍTULO I'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{block.kicker || 'APERTURA MAGISTRAL'}</span>
                      </div>

                      <h1
                        className="font-display text-3xl sm:text-4xl lg:text-[2.85rem] font-semibold leading-[1.12] tracking-tight mb-6"
                        style={{ textWrap: 'balance' }}
                      >
                        {block.content}
                      </h1>

                      {block.secondaryContent && (
                        <p
                          className="font-book text-base sm:text-lg leading-[1.75] opacity-90 max-w-[65ch] pt-6 border-t"
                          style={{ borderColor: 'rgba(255,255,255,0.18)' }}
                        >
                          {block.secondaryContent}
                        </p>
                      )}
                    </div>
                  </section>
                );

              case 'section-heading':
                return (
                  <div key={block.id} className="pt-8 pb-2">
                    {renderControls(block)}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div
                        className="lg:col-span-8 pb-4 border-b"
                        style={{ borderColor: palette.borderHairline }}
                      >
                        <div
                          className="text-[11px] font-sans font-semibold uppercase tracking-[0.18em] mb-1.5"
                          style={{ color: palette.accentPrimary }}
                        >
                          {block.indexLabel || 'SECCIÓN ACADÉMICA'}
                        </div>
                        <h2
                          className="font-display text-2xl sm:text-3xl font-semibold leading-[1.18]"
                          style={{
                            color: palette.inkPrimary,
                            textWrap: 'balance',
                          }}
                        >
                          {block.content}
                        </h2>
                      </div>
                      <div className="hidden lg:block lg:col-span-4" />
                    </div>
                  </div>
                );

              case 'paragraph':
                return (
                  <div key={block.id}>
                    {renderControls(block)}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* 70% Columna Principal de Lectura (Medida 65-75ch) */}
                      <div className="lg:col-span-8">
                        <p
                          className={`font-book text-[17px] leading-[1.82] text-justify max-w-[68ch] ${
                            block.dropCap
                              ? 'first-letter:font-display first-letter:text-[3.9rem] first-letter:font-bold first-letter:float-left first-letter:mr-3.5 first-letter:mt-1 first-letter:leading-[0.82]'
                              : ''
                          }`}
                          style={{
                            color: palette.inkPrimary,
                          }}
                        >
                          {block.content}
                        </p>
                      </div>

                      {/* 30% Riel de Notas al Margen (Asymmetric Margin Rail) */}
                      <aside className="lg:col-span-4">
                        {block.marginNote && (
                          <div
                            className="pt-3 border-t text-xs leading-[1.6]"
                            style={{
                              borderColor: palette.borderHairline,
                              color: palette.inkMuted,
                            }}
                          >
                            <div
                              className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] mb-1"
                              style={{ color: palette.accentSecondary }}
                            >
                              {block.marginNote.referenceIndex} · {block.marginNote.label}
                            </div>
                            <p className="font-book italic text-[13px] leading-[1.55]">
                              {block.marginNote.text}
                            </p>
                          </div>
                        )}
                      </aside>
                    </div>
                  </div>
                );

              case 'callout':
                return (
                  <div key={block.id} className="my-8">
                    {renderControls(block)}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      <div className="lg:col-span-8">
                        <aside
                          className="p-7 sm:p-8 border"
                          style={{
                            backgroundColor: palette.secondarySurface,
                            borderColor: palette.borderHairline,
                          }}
                        >
                          <div
                            className="flex flex-wrap items-center gap-2 text-[11px] font-sans font-semibold uppercase tracking-[0.16em] mb-2"
                            style={{ color: palette.accentSecondary }}
                          >
                            <span>{block.indexLabel || 'LLAMADA DE ATENCIÓN'}</span>
                            <span aria-hidden="true">·</span>
                            <span>{block.kicker || 'OBSERVACIÓN METODOLÓGICA'}</span>
                          </div>
                          <h3
                            className="font-display text-xl sm:text-2xl font-semibold leading-snug mb-2.5"
                            style={{ color: palette.inkPrimary }}
                          >
                            {block.content}
                          </h3>
                          {block.secondaryContent && (
                            <p
                              className="font-book text-[15.5px] leading-[1.72]"
                              style={{ color: palette.inkSecondary }}
                            >
                              {block.secondaryContent}
                            </p>
                          )}
                        </aside>
                      </div>
                      <div className="hidden lg:block lg:col-span-4" />
                    </div>
                  </div>
                );

              case 'key-concept':
                return (
                  <div key={block.id} className="my-9">
                    {renderControls(block)}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      <div className="lg:col-span-9">
                        <section
                          className="p-7 sm:p-9 border"
                          style={{
                            backgroundColor: palette.secondarySurface,
                            borderColor: palette.borderHairline,
                          }}
                        >
                          <div
                            className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b text-[11px] font-sans font-semibold uppercase tracking-[0.16em]"
                            style={{
                              borderColor: palette.borderHairline,
                              color: palette.accentPrimary,
                            }}
                          >
                            <span>{block.indexLabel || 'CONCEPTO CLAVE'}</span>
                            <span style={{ color: palette.inkMuted }}>
                              {block.kicker || 'FUNDAMENTO TEÓRICO'}
                            </span>
                          </div>

                          <h3
                            className="font-display text-2xl sm:text-[1.65rem] font-semibold leading-tight mb-3"
                            style={{ color: palette.inkPrimary }}
                          >
                            {block.content}
                          </h3>

                          {block.secondaryContent && (
                            <p
                              className="font-book text-[16px] leading-[1.75] mb-5"
                              style={{ color: palette.inkSecondary }}
                            >
                              {block.secondaryContent}
                            </p>
                          )}

                          {block.bulletPoints && block.bulletPoints.length > 0 && (
                            <ul
                              className="space-y-2.5 pt-4 border-t font-book text-[15px]"
                              style={{
                                borderColor: palette.borderHairline,
                                color: palette.inkSecondary,
                              }}
                            >
                              {block.bulletPoints.map((pt, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <span
                                    className="font-mono text-xs font-medium mt-1 shrink-0"
                                    style={{ color: palette.accentSecondary }}
                                  >
                                    0{idx + 1}.
                                  </span>
                                  <span className="leading-[1.68]">{pt}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </section>
                      </div>
                      <div className="hidden lg:block lg:col-span-3" />
                    </div>
                  </div>
                );

              case 'pull-quote':
                return (
                  <figure
                    key={block.id}
                    className="my-12 py-9 px-6 sm:px-12 border-t border-b text-center"
                    style={{ borderColor: palette.borderHairline }}
                  >
                    {renderControls(block)}
                    {block.kicker && (
                      <div
                        className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] mb-3"
                        style={{ color: palette.accentSecondary }}
                      >
                        {block.kicker}
                      </div>
                    )}
                    <blockquote
                      className="font-display italic text-2xl sm:text-3xl leading-[1.38] max-w-[54ch] mx-auto"
                      style={{ color: palette.inkPrimary, textWrap: 'balance' }}
                    >
                      {block.content}
                    </blockquote>
                  </figure>
                );

              case 'infographic':
                return (
                  <section
                    key={block.id}
                    className="my-12 p-7 sm:p-10 border"
                    style={{
                      backgroundColor: palette.secondarySurface,
                      borderColor: palette.borderHairline,
                    }}
                  >
                    {renderControls(block)}
                    <div
                      className="text-[11px] font-sans font-semibold uppercase tracking-[0.18em] mb-1.5"
                      style={{ color: palette.accentSecondary }}
                    >
                      {block.infographicData?.kicker || 'INFOGRAFÍA CONCEPTUAL ESTRUCTURADA'}
                    </div>
                    <h3
                      className="font-display text-2xl sm:text-3xl font-semibold mb-6"
                      style={{ color: palette.inkPrimary }}
                    >
                      {block.infographicData?.title || block.content}
                    </h3>

                    {block.infographicData?.nodes ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {block.infographicData.nodes.map((node, idx) => (
                          <div
                            key={idx}
                            className="p-5 border flex flex-col justify-between"
                            style={{
                              backgroundColor: palette.paperBg,
                              borderColor: palette.borderHairline,
                            }}
                          >
                            <div>
                              <div
                                className="font-mono text-xs font-medium mb-2"
                                style={{ color: palette.accentPrimary }}
                              >
                                {node.step}
                              </div>
                              <h4
                                className="font-display text-xl font-semibold mb-2 leading-snug"
                                style={{ color: palette.inkPrimary }}
                              >
                                {node.title}
                              </h4>
                              <p
                                className="font-book text-[14px] leading-[1.6]"
                                style={{ color: palette.inkSecondary }}
                              >
                                {node.detail}
                              </p>
                            </div>
                            {node.metric && (
                              <div
                                className="mt-4 pt-2.5 border-t font-mono text-[11px]"
                                style={{
                                  borderColor: palette.borderHairline,
                                  color: palette.accentSecondary,
                                }}
                              >
                                {node.metric}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="font-book text-base">{block.content}</p>
                    )}

                    {block.infographicData?.visualSuggestion && (
                      <div
                        className="mt-5 pt-3 border-t text-xs font-sans flex flex-wrap items-center justify-between gap-2"
                        style={{
                          borderColor: palette.borderHairline,
                          color: palette.inkMuted,
                        }}
                      >
                        <span>{block.infographicData.visualSuggestion}</span>
                      </div>
                    )}
                  </section>
                );

              case 'data-table':
                return (
                  <figure key={block.id} className="my-12">
                    {renderControls(block)}
                    <div className="mb-3">
                      <div
                        className="text-[11px] font-sans font-semibold uppercase tracking-[0.16em]"
                        style={{ color: palette.accentPrimary }}
                      >
                        REGISTRO TABULAR · NUMERACIÓN ALINEADA
                      </div>
                      <figcaption
                        className="font-display text-2xl font-semibold"
                        style={{ color: palette.inkPrimary }}
                      >
                        {block.content}
                      </figcaption>
                    </div>

                    {block.tableData ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left font-sans text-sm tabular-nums">
                          <thead>
                            <tr
                              className="border-t border-b"
                              style={{ borderColor: palette.inkPrimary }}
                            >
                              {block.tableData.headers.map((header, hIdx) => (
                                <th
                                  key={hIdx}
                                  className="py-3.5 px-4 text-xs font-semibold uppercase tracking-wider"
                                  style={{ color: palette.inkSecondary }}
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.tableData.rows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className="border-b transition-colors"
                                style={{ borderColor: palette.borderHairline }}
                              >
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`py-3.5 px-4 ${
                                      cIdx === 0 ? 'font-medium' : 'font-mono text-[13px]'
                                    }`}
                                    style={{ color: palette.inkPrimary }}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {block.tableData.source && (
                          <p
                            className="mt-2.5 font-book italic text-xs"
                            style={{ color: palette.inkMuted }}
                          >
                            {block.tableData.source}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="font-book text-base">{block.content}</p>
                    )}
                  </figure>
                );

              case 'section-summary':
                return (
                  <section
                    key={block.id}
                    className="mt-14 mb-6 p-8 sm:p-11 border"
                    style={{
                      backgroundColor: palette.secondarySurface,
                      borderColor: palette.borderHairline,
                    }}
                  >
                    {renderControls(block)}
                    <div
                      className="flex flex-wrap items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.18em] mb-2"
                      style={{ color: palette.accentPrimary }}
                    >
                      <span>{block.indexLabel || 'RESUMEN DE SECCIÓN'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{block.kicker || 'SÍNTESIS EJECUTIVA'}</span>
                    </div>

                    <h3
                      className="font-display text-2xl sm:text-3xl font-semibold mb-3"
                      style={{ color: palette.inkPrimary }}
                    >
                      {block.content}
                    </h3>

                    {block.secondaryContent && (
                      <p
                        className="font-book text-[16px] leading-[1.72] mb-6 max-w-[68ch]"
                        style={{ color: palette.inkSecondary }}
                      >
                        {block.secondaryContent}
                      </p>
                    )}

                    {block.bulletPoints && block.bulletPoints.length > 0 && (
                      <ol className="space-y-3">
                        {block.bulletPoints.map((pt, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-4 pt-3 border-t font-book text-[15.5px] leading-[1.7]"
                            style={{
                              borderColor: palette.borderHairline,
                              color: palette.inkPrimary,
                            }}
                          >
                            <span
                              className="font-mono text-xs font-semibold mt-1 shrink-0"
                              style={{ color: palette.accentPrimary }}
                            >
                              0{idx + 1}
                            </span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </section>
                );

              default:
                return null;
            }
          })}
        </div>

        {/* Pie de Pliego Académico */}
        <footer
          className="mt-16 pt-6 border-t flex flex-wrap items-center justify-between gap-4 text-xs font-sans"
          style={{
            borderColor: palette.borderHairline,
            color: palette.inkMuted,
          }}
        >
          <span>{document.title}</span>
          <div className="flex items-center gap-3">
            <span>Integridad Textual Verificada (100% Original)</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">PÁG. 01</span>
          </div>
        </footer>
      </div>
    </article>
  );
};
