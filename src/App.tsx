import React, { useRef, useState } from 'react';
import {
  BookOpen,
  Download,
  FileText,
  Printer,
  RotateCcw,
  Sliders,
  Upload,
} from 'lucide-react';
import {
  EDITORIAL_PALETTES,
  SAMPLE_EDITORIAL_DOCUMENT,
} from './data/sampleManuscript';
import {
  EditorialBlockType,
  EditorialDocument,
  PaletteId,
} from './types/editorial';
import {
  parseDocxToEditorialDocument,
  parseRawTextToEditorialDocument,
} from './utils/manuscriptParser';
import { LuxuryBookRenderer } from './components/LuxuryBookRenderer';
import { TechnicalSpecSheet } from './components/TechnicalSpecSheet';
import { generateStandaloneLuxuryHtml } from './utils/exportGenerators';

type ActiveTab = 'preview' | 'indesign' | 'html-css' | 'import';

export default function App() {
  const [editorialDoc, setEditorialDoc] = useState<EditorialDocument>(
    SAMPLE_EDITORIAL_DOCUMENT
  );
  const [selectedPaletteId, setSelectedPaletteId] =
    useState<PaletteId>('oxford-gold');
  const [activeTab, setActiveTab] = useState<ActiveTab>('preview');
  const [interactiveEditMode, setInteractiveEditMode] = useState<boolean>(false);

  // Import state
  const [rawPasteText, setRawPasteText] = useState<string>('');
  const [customTitleInput, setCustomTitleInput] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentPalette =
    EDITORIAL_PALETTES.find((p) => p.id === selectedPaletteId) ||
    EDITORIAL_PALETTES[0];

  // Handle .docx file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setUploadStatus(`Procesando manuscrito «${file.name}» conservando el 100% del texto original...`);

    try {
      if (file.name.toLowerCase().endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const parsed = await parseDocxToEditorialDocument(arrayBuffer, file.name);
        setEditorialDoc(parsed);
        setUploadStatus(
          `Manuscrito «${file.name}» maquetado con éxito (${parsed.blocks.length} bloques estructurales).`
        );
        setActiveTab('preview');
      } else {
        const text = await file.text();
        const parsed = parseRawTextToEditorialDocument(
          text,
          file.name.replace(/\.[^.]+$/, '')
        );
        setEditorialDoc(parsed);
        setUploadStatus(
          `Documento «${file.name}» maquetado con éxito (${parsed.blocks.length} bloques estructurales).`
        );
        setActiveTab('preview');
      }
    } catch (err) {
      setUploadStatus(
        'No se pudo leer el archivo binario. Asegúrate de subir un documento Word (.docx) o archivo de texto (.txt/.md).'
      );
      console.error(err);
    } finally {
      setIsParsing(false);
    }
  };

  // Handle pasted Word content
  const handleApplyPastedText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawPasteText.trim()) return;

    const parsed = parseRawTextToEditorialDocument(
      rawPasteText,
      customTitleInput.trim() || undefined
    );
    setEditorialDoc(parsed);
    setUploadStatus(
      `Texto original maquetado (${parsed.blocks.length} bloques). Ninguna palabra fue modificada.`
    );
    setActiveTab('preview');
  };

  // Block role switching without altering wording
  const handleChangeBlockType = (
    blockId: string,
    newType: EditorialBlockType
  ) => {
    setEditorialDoc((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => {
        if (b.id !== blockId) return b;
        return {
          ...b,
          type: newType,
          indexLabel:
            newType === 'chapter-opener'
              ? 'CAPÍTULO I'
              : newType === 'key-concept'
              ? 'CONCEPTO CLAVE'
              : newType === 'callout'
              ? 'LLAMADA DE ATENCIÓN'
              : newType === 'section-summary'
              ? 'RESUMEN DE SECCIÓN'
              : b.indexLabel,
          kicker:
            newType === 'callout'
              ? 'OBSERVACIÓN EDITORIAL'
              : newType === 'key-concept'
              ? 'DEFINICIÓN FUNDAMENTAL'
              : b.kicker,
        };
      }),
    }));
  };

  const handleToggleDropCap = (blockId: string) => {
    setEditorialDoc((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === blockId ? { ...b, dropCap: !b.dropCap } : b
      ),
    }));
  };

  const handleToggleMarginNote = (blockId: string) => {
    setEditorialDoc((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => {
        if (b.id !== blockId) return b;
        if (b.marginNote) {
          return { ...b, marginNote: undefined };
        }
        const firstSentence =
          b.content.split(/(?<=[.!?])\s+/)[0] || b.content.slice(0, 115);
        return {
          ...b,
          marginNote: {
            id: `mn-${b.id}`,
            referenceIndex: 'Nota al Margen',
            label: 'Síntesis Marginal',
            text: firstSentence,
          },
        };
      }),
    }));
  };

  const handleDownloadHtmlDirect = () => {
    const html = generateStandaloneLuxuryHtml(editorialDoc, currentPalette);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = 'publicacion-editorial-lujo.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F0E8] text-[#1C1917]">
      {/* Top Bar Contract: 1-row, 3-zone header separated by gap-8 */}
      <header className="no-print sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-stone-200 px-6 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('preview');
          }}
          className="font-display text-2xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0"
        >
          Atelier Folio
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-sans font-medium text-stone-600">
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeTab === 'import'
                ? 'text-stone-900 border-b border-stone-900'
                : ''
            }`}
          >
            Cargar Word
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeTab === 'preview'
                ? 'text-stone-900 border-b border-stone-900'
                : ''
            }`}
          >
            Pliego Editorial
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('indesign')}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeTab === 'indesign'
                ? 'text-stone-900 border-b border-stone-900'
                : ''
            }`}
          >
            Guía InDesign & Canva
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('html-css')}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
              activeTab === 'html-css'
                ? 'text-stone-900 border-b border-stone-900'
                : ''
            }`}
          >
            Código HTML/CSS
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDownloadHtmlDirect}
            className="px-4 py-2 text-xs font-sans font-medium text-white bg-[#111C38] hover:bg-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Exportar Edición
          </button>
        </div>
      </header>

      {/* Sub-barra de Control Curatorial y Carga Rápida de Manuscrito Word */}
      <section className="no-print bg-[#FBF9F5] border-b border-stone-200 px-6 py-5">
        <div className="max-w-[1160px] mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Izquierda: Estado del documento e integridad textual */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-stone-500">
              <span className="font-semibold text-[#1E3A8A] uppercase tracking-wider">
                ESTILO «LIBRO DE ESTUDIO CARO»
              </span>
              <span aria-hidden="true">·</span>
              <span>Contenido original 100% intacto</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{editorialDoc.blocks.length} bloques</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-stone-900">
              {editorialDoc.title}
            </h2>
          </div>

          {/* Derecha: Selector de Paleta, Modo de Ajuste de Bloques y Botón de Subida .DOCX */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Selector de Paleta */}
            <div className="flex items-center gap-1 p-1 bg-stone-200/70 border border-stone-300/80">
              {EDITORIAL_PALETTES.map((pal) => (
                <button
                  key={pal.id}
                  type="button"
                  onClick={() => setSelectedPaletteId(pal.id)}
                  className={`px-3 py-1.5 text-xs font-sans font-medium transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedPaletteId === pal.id
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 border border-stone-400 inline-block"
                    style={{ backgroundColor: pal.accentPrimary }}
                  />
                  <span>{pal.name.split('&')[0].trim()}</span>
                </button>
              ))}
            </div>

            {/* Botón para alternar asignación manual de cajas de llamada / conceptos clave */}
            <button
              type="button"
              onClick={() => setInteractiveEditMode(!interactiveEditMode)}
              className={`px-3.5 py-2 text-xs font-sans font-medium border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                interactiveEditMode
                  ? 'bg-[#78350F] text-white border-[#78350F]'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>
                {interactiveEditMode
                  ? 'Ocultar Selector de Cajas'
                  : 'Asignar Cajas / Roles'}
              </span>
            </button>

            {/* Botón directo para subir o pegar Word */}
            <button
              type="button"
              onClick={() => setActiveTab('import')}
              className="px-3.5 py-2 text-xs font-sans font-medium bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importar tu Word (.docx / Texto)</span>
            </button>
          </div>
        </div>

        {/* Barra de navegación móvil */}
        <div className="flex md:hidden items-center gap-2 mt-4 pt-3 border-t border-stone-200 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 text-xs font-sans font-medium whitespace-nowrap ${
              activeTab === 'import'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-700'
            }`}
          >
            1. Cargar Word
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 text-xs font-sans font-medium whitespace-nowrap ${
              activeTab === 'preview'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-700'
            }`}
          >
            2. Pliego Maquetado
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('indesign')}
            className={`px-3 py-1.5 text-xs font-sans font-medium whitespace-nowrap ${
              activeTab === 'indesign'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-700'
            }`}
          >
            3. Guía InDesign/Canva
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('html-css')}
            className={`px-3 py-1.5 text-xs font-sans font-medium whitespace-nowrap ${
              activeTab === 'html-css'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-700'
            }`}
          >
            4. Código HTML/CSS
          </button>
        </div>
      </section>

      {/* Área Principal de Trabajo */}
      <main className="flex-1 px-4 sm:px-6 py-10">
        {activeTab === 'import' && (
          <div className="max-w-[1160px] mx-auto space-y-8">
            <section className="bg-[#FBF9F5] border border-stone-300 p-8 sm:p-12">
              <div className="max-w-3xl mb-8">
                <div className="text-xs font-sans font-semibold uppercase tracking-[0.18em] text-[#78350F] mb-2">
                  RECEPCIÓN DE MANUSCRITO ORIGINAL · CERO ALTERACIÓN DE CONTENIDO
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 mb-3">
                  Proporciona tu Documento Word para Maquetación de Lujo
                </h1>
                <p className="font-book text-base text-stone-700 leading-relaxed">
                  Sube directamente tu archivo <code className="font-mono text-xs">.docx</code> o
                  pega a continuación el texto íntegro de tu documento Word. El motor editorial
                  mantendrá cada frase, cifra y párrafo exactamente como fue escrito, aplicando
                  portadillas de capítulo, retícula asimétrica 70/30 con notas al margen,
                  recuadros de conceptos clave, llamadas de atención e infografías conceptuales.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Columna 1: Subir archivo .docx */}
                <div className="lg:col-span-5 flex flex-col justify-between p-7 bg-white border border-stone-200">
                  <div>
                    <div className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-[#1E3A8A] mb-2">
                      OPCIÓN A · ARCHIVO DIRECTO (.DOCX / .TXT / .MD)
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-stone-900 mb-3">
                      Subir Documento Word Original
                    </h3>
                    <p className="font-book text-sm text-stone-600 leading-relaxed mb-6">
                      Analiza automáticamente encabezados H1/H2, párrafos de cuerpo, listas de
                      conceptos y tablas de Word sin modificar ni resumir tu texto.
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".docx,.txt,.md"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isParsing}
                      className="w-full py-4 px-5 border border-stone-800 bg-[#111C38] text-white hover:bg-[#1E3A8A] transition-colors font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>
                        {isParsing
                          ? 'Maquetando Documento...'
                          : 'Seleccionar Archivo Word (.docx)'}
                      </span>
                    </button>
                  </div>

                  <div className="mt-8 pt-5 border-t border-stone-200 flex items-center justify-between text-xs font-sans text-stone-500">
                    <span>¿Quieres volver al tratado de muestra?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditorialDoc(SAMPLE_EDITORIAL_DOCUMENT);
                        setActiveTab('preview');
                      }}
                      className="text-[#1E3A8A] underline font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurar Muestra</span>
                    </button>
                  </div>
                </div>

                {/* Columna 2: Pegar texto del Word */}
                <form
                  onSubmit={handleApplyPastedText}
                  className="lg:col-span-7 p-7 bg-white border border-stone-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-[#78350F] mb-2">
                      OPCIÓN B · COPIAR Y PEGAR CONTENIDO DEL WORD
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-stone-900 mb-3">
                      Pegar Texto Íntegro del Documento
                    </h3>

                    <div className="mb-4">
                      <label className="block text-xs font-sans font-medium text-stone-700 mb-1">
                        Título de la Publicación o Capítulo Principal (Opcional):
                      </label>
                      <input
                        type="text"
                        value={customTitleInput}
                        onChange={(e) => setCustomTitleInput(e.target.value)}
                        placeholder="Ej. Tratado de Derecho Constitucional Comparado..."
                        className="w-full px-3.5 py-2 text-sm font-book bg-[#FBF9F5] border border-stone-300 focus:outline-none focus:border-[#1E3A8A]"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-sans font-medium text-stone-700 mb-1">
                        Pega aquí el contenido de tu Word (Consejo: usa «Nota:», «Concepto clave:» o listas para generar recuadros automáticos):
                      </label>
                      <textarea
                        rows={8}
                        value={rawPasteText}
                        onChange={(e) => setRawPasteText(e.target.value)}
                        placeholder={`CAPÍTULO I: Título de tu capítulo\n\nPega aquí los párrafos de tu documento Word...\n\nConcepto clave: Pega aquí una definición importante...\n\nNota: Pega aquí una llamada de atención...\n\nColumna 1 | Columna 2 | Columna 3\nDato A | 12.4% | 450 unidades`}
                        className="w-full p-3.5 text-sm font-book bg-[#FBF9F5] border border-stone-300 focus:outline-none focus:border-[#1E3A8A] leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <span className="text-xs font-sans text-stone-500">
                      Se respetará el 100% de la literalidad del texto pegado.
                    </span>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#111C38] text-white hover:bg-[#1E3A8A] transition-colors text-xs font-sans font-semibold uppercase tracking-wider cursor-pointer whitespace-nowrap"
                    >
                      Transformar en Maquetación de Lujo
                    </button>
                  </div>
                </form>
              </div>

              {uploadStatus && (
                <div className="mt-6 p-4 bg-stone-100 border border-stone-300 text-xs font-sans text-stone-800 flex items-center justify-between">
                  <span>{uploadStatus}</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className="font-semibold text-[#1E3A8A] underline cursor-pointer"
                  >
                    Ver Pliego Maquetado →
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            {/* Barra de herramientas sobre el pliego */}
            <div className="no-print max-w-[1160px] mx-auto flex flex-wrap items-center justify-between gap-4 px-5 py-3 bg-[#FBF9F5] border border-stone-200 text-xs font-sans text-stone-600">
              <div className="flex flex-wrap items-center gap-3">
                <BookOpen className="w-4 h-4 text-[#1E3A8A]" />
                <span>
                  <strong>Vista de Pliego Impreso:</strong> Tipografía{' '}
                  <em>Cormorant Garamond</em> + <em>Source Serif 4</em> · Retícula 70/30 con
                  notas marginales.
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="text-stone-800 hover:text-[#1E3A8A] font-medium flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Pliego / PDF</span>
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('indesign')}
                  className="text-[#78350F] hover:underline font-medium flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Especificaciones InDesign/Canva</span>
                </button>
              </div>
            </div>

            <LuxuryBookRenderer
              document={editorialDoc}
              palette={currentPalette}
              interactiveMode={interactiveEditMode}
              onChangeBlockType={handleChangeBlockType}
              onToggleDropCap={handleToggleDropCap}
              onAddMarginNote={handleToggleMarginNote}
            />
          </div>
        )}

        {activeTab === 'indesign' && (
          <TechnicalSpecSheet
            document={editorialDoc}
            palette={currentPalette}
            mode="indesign"
          />
        )}

        {activeTab === 'html-css' && (
          <TechnicalSpecSheet
            document={editorialDoc}
            palette={currentPalette}
            mode="html-css"
          />
        )}
      </main>

      {/* Pie de página sobrio e institucional */}
      <footer className="no-print border-t border-stone-300 bg-[#FBF9F5] px-6 py-6 mt-12">
        <div className="max-w-[1160px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-stone-500">
          <div>
            <span className="font-display font-bold text-sm text-stone-900">
              Atelier Folio
            </span>
            <span className="mx-2">·</span>
            <span>
              Sistema de Maquetación de Libros de Estudio y Publicaciones Académicas de Lujo
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('import')}
              className="hover:text-stone-900 underline cursor-pointer"
            >
              Subir otro documento Word
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleDownloadHtmlDirect}
              className="hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar HTML/CSS</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
