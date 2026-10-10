import React, { useState } from 'react';
import { Check, Copy, Download, FileCode, Layers, Printer } from 'lucide-react';
import { EditorialDocument, EditorialPalette } from '../types/editorial';
import {
  generateInDesignTechnicalGuide,
  generateStandaloneLuxuryHtml,
} from '../utils/exportGenerators';

interface TechnicalSpecSheetProps {
  document: EditorialDocument;
  palette: EditorialPalette;
  mode: 'indesign' | 'html-css';
}

export const TechnicalSpecSheet: React.FC<TechnicalSpecSheetProps> = ({
  document,
  palette,
  mode,
}) => {
  const [copied, setCopied] = useState(false);

  const outputContent =
    mode === 'indesign'
      ? generateInDesignTechnicalGuide(document, palette)
      : generateStandaloneLuxuryHtml(document, palette);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputContent], {
      type: mode === 'indesign' ? 'text/plain;charset=utf-8' : 'text/html;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    const safeTitle = document.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    a.download =
      mode === 'indesign'
        ? `${safeTitle || 'maquetacion'}-especificaciones-indesign-canva.txt`
        : `${safeTitle || 'maquetacion'}-edicion-lujo.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (mode === 'indesign') {
    return (
      <div className="w-full max-w-[1160px] mx-auto space-y-8">
        {/* Resumen Visual de Especificaciones Técnicas para InDesign / Canva */}
        <section className="bg-white border border-stone-200 p-8 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200">
            <div>
              <div className="text-xs font-sans uppercase tracking-[0.18em] text-[#78350F] font-semibold mb-1">
                ESPECIFICACIONES TÉCNICAS PASO A PASO · INDESIGN & CANVA PRO
              </div>
              <h2 className="font-display text-3xl font-semibold text-stone-900">
                Hoja de Ruta de Maquetación Profesional
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 text-xs font-sans font-medium border border-stone-300 text-stone-800 hover:bg-stone-100 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado al Portapapeles' : 'Copiar Guía Técnica'}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 text-xs font-sans font-medium bg-[#111C38] text-white hover:bg-[#1E3A8A] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar Especificaciones (.TXT)
              </button>
            </div>
          </div>

          {/* 3 Tarjetas de Parámetros Exactos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-[#FBF9F5] border border-stone-200">
              <div className="text-[11px] font-sans font-semibold uppercase tracking-[0.16em] text-[#1E3A8A] mb-2">
                01. CAJA Y MÁRGENES (MM)
              </div>
              <h3 className="font-display text-xl font-semibold text-stone-900 mb-3">
                Formato Crown Quarto & Retícula
              </h3>
              <dl className="space-y-2 text-xs font-sans text-stone-700 tabular-nums">
                <div className="flex justify-between py-1 border-b border-stone-200/80">
                  <dt className="text-stone-500">Dimensiones de Pliego:</dt>
                  <dd className="font-mono font-medium">189 × 246 mm</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/80">
                  <dt className="text-stone-500">Margen Superior / Inferior:</dt>
                  <dd className="font-mono font-medium">24 mm / 32 mm</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/80">
                  <dt className="text-stone-500">Margen Lomo (Interior):</dt>
                  <dd className="font-mono font-medium">26 mm</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/80">
                  <dt className="text-stone-500">Margen Corte + Riel Notas:</dt>
                  <dd className="font-mono font-medium">54 mm (Col. 38 mm)</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-stone-500">Cuadrícula Base (Leading):</dt>
                  <dd className="font-mono font-medium">14.0 pt exactos</dd>
                </div>
              </dl>
            </div>

            <div className="p-6 bg-[#FBF9F5] border border-stone-200">
              <div className="text-[11px] font-sans font-semibold uppercase tracking-[0.16em] text-[#78350F] mb-2">
                02. ESCALA TIPOGRÁFICA (PT)
              </div>
              <h3 className="font-display text-xl font-semibold text-stone-900 mb-3">
                Combinación Clásica & Display
              </h3>
              <dl className="space-y-2 text-xs font-sans text-stone-700 tabular-nums">
                <div className="flex justify-between py-1 border-b border-stone-200/80">
                  <dt className="text-stone-500">Portadilla Capítulo (Display):</dt>
                  <dd className="font-mono font-medium">34 pt / 38 pt</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/80">
                  <dt className="text-stone-500">Titular Sección H2:</dt>
                  <dd className="font-mono font-medium">21 pt / 25 pt</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/80">
                  <dt className="text-stone-500">Cuerpo Prosa (Serif):</dt>
                  <dd className="font-mono font-medium">10.5 pt / 15.5 pt</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/80">
                  <dt className="text-stone-500">Notas al Margen (Riel 30%):</dt>
                  <dd className="font-mono font-medium">8.5 pt / 11.5 pt</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-stone-500">Kickers & Cabeceras Tabla:</dt>
                  <dd className="font-mono font-medium">7.5 pt (Track +160)</dd>
                </div>
              </dl>
            </div>

            <div className="p-6 bg-[#FBF9F5] border border-stone-200">
              <div className="text-[11px] font-sans font-semibold uppercase tracking-[0.16em] text-[#1E3A8A] mb-2">
                03. SISTEMA CROMÁTICO & FILETES
              </div>
              <h3 className="font-display text-xl font-semibold text-stone-900 mb-3">
                Paleta «{palette.name}»
              </h3>
              <div className="space-y-2.5 text-xs font-sans">
                <div className="flex items-center justify-between py-1 border-b border-stone-200/80">
                  <span className="text-stone-600">Papel Base / Alabastro:</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 border border-stone-300 inline-block"
                      style={{ backgroundColor: palette.paperBg }}
                    />
                    <span className="font-mono">{palette.paperBg}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-stone-200/80">
                  <span className="text-stone-600">Portadilla Capítulo:</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 border border-stone-300 inline-block"
                      style={{ backgroundColor: palette.chapterPlateBg }}
                    />
                    <span className="font-mono">{palette.chapterPlateBg}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-stone-200/80">
                  <span className="text-stone-600">Acento Principal:</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 border border-stone-300 inline-block"
                      style={{ backgroundColor: palette.accentPrimary }}
                    />
                    <span className="font-mono">{palette.accentPrimary}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-stone-600">Acento Dorado / Terracota:</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 border border-stone-300 inline-block"
                      style={{ backgroundColor: palette.accentSecondary }}
                    />
                    <span className="font-mono">{palette.accentSecondary}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Especificación Completa Bloque a Bloque */}
          <div>
            <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-stone-500 mb-3">
              <Layers className="w-4 h-4 text-[#1E3A8A]" />
              <span>Desglose Técnico Completo para Producción (InDesign / Canva)</span>
            </div>
            <pre className="p-6 bg-stone-900 text-stone-100 font-mono text-xs leading-relaxed overflow-x-auto max-h-[540px] border border-stone-800">
              {outputContent}
            </pre>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1160px] mx-auto space-y-6">
      <section className="bg-white border border-stone-200 p-8 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-200">
          <div>
            <div className="text-xs font-sans uppercase tracking-[0.18em] text-[#1E3A8A] font-semibold mb-1">
              CÓDIGO LIMPIO CON ESTILOS CSS EMBEBIDOS · E-BOOK & PLIEGO IMPRESO
            </div>
            <h2 className="font-display text-3xl font-semibold text-stone-900">
              Exportación HTML5 + CSS Editorial Autónomo
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-sans font-medium border border-stone-300 text-stone-800 hover:bg-stone-100 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / Guardar PDF
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-sans font-medium border border-stone-300 text-stone-800 hover:bg-stone-100 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Código Copiado' : 'Copiar HTML/CSS'}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-sans font-medium bg-[#111C38] text-white hover:bg-[#1E3A8A] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <FileCode className="w-3.5 h-3.5" />
              Descargar E-Book (.HTML)
            </button>
          </div>
        </div>

        <p className="font-book text-sm text-stone-600 mb-4">
          Este código HTML5 incluye todas las reglas tipográficas, retícula asimétrica 70/30 para
          notas al margen, portadillas de capítulo, recuadros de conceptos clave, tablas con
          números tabulares y reglas <code className="font-mono text-xs">@media print</code> sin
          alterar ni una sola palabra de tu documento Word original.
        </p>

        <pre className="p-6 bg-stone-900 text-stone-100 font-mono text-xs leading-relaxed overflow-x-auto max-h-[600px] border border-stone-800">
          {outputContent}
        </pre>
      </section>
    </div>
  );
};
