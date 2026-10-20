import * as XLSX from 'xlsx';
import { Category, OtherItem, CountingSession } from '../types/counter';

export function generateExcelWorkbook(session: CountingSession): void {
  const wb = XLSX.utils.book_new();

  const totalVacunos = session.categories.reduce((acc, cat) => acc + cat.count, 0);
  const totalOtros = session.otherItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalGeneral = totalVacunos + totalOtros;

  // ---------------------------------------------------------
  // HOJA 1: RESUMEN DE CONTEO
  // ---------------------------------------------------------
  const resumenRows: (string | number)[][] = [
    ['PLANILLA DE CONTEO GANADERO - CONTROL DE HACIENDA'],
    ['Generado con Contador Ganadero Pro'],
    [],
    ['DATOS DE LA SESIÓN'],
    ['Establecimiento / Campo:', session.campo || 'No especificado'],
    ['Potrero / Lote:', session.potrero || 'No especificado'],
    ['Responsable / Operador:', session.operador || 'No especificado'],
    ['Fecha del Conteo:', session.fecha],
    ['Hora de Guardado:', new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })],
    [],
    ['DETALLE POR CATEGORÍA VACUNA'],
    ['Categoría', 'Descripción', 'Cantidad (Cabezas)', '% del Rodeo'],
  ];

  session.categories.forEach(cat => {
    const pct = totalGeneral > 0 ? ((cat.count / totalGeneral) * 100).toFixed(1) + '%' : '0.0%';
    resumenRows.push([cat.name, cat.subtext || '-', cat.count, pct]);
  });

  const pctVacunos = totalGeneral > 0 ? ((totalVacunos / totalGeneral) * 100).toFixed(1) + '%' : '0.0%';
  const pctOtros = totalGeneral > 0 ? ((totalOtros / totalGeneral) * 100).toFixed(1) + '%' : '0.0%';

  resumenRows.push(
    [],
    ['SUBTOTAL VACUNOS POR CATEGORÍA', '', totalVacunos, pctVacunos],
    ['SUBTOTAL VACUNOS CON NOVEDADES / OBSERVACIONES', '', totalOtros, pctOtros],
    ['TOTAL GENERAL DE VACUNOS', '', totalGeneral, '100.0%'],
    [],
    ['OBSERVACIONES GENERALES:'],
    [session.notes || 'Sin observaciones generales registradas.']
  );

  const wsResumen = XLSX.utils.aoa_to_sheet(resumenRows);

  // Set column widths for readability on mobile and desktop
  wsResumen['!cols'] = [
    { wch: 32 },
    { wch: 24 },
    { wch: 18 },
    { wch: 16 },
  ];

  XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen General');

  // ---------------------------------------------------------
  // HOJA 2: DETALLE DE OTROS Y NOVEDADES (OBSERVACIONES)
  // ---------------------------------------------------------
  const otrosRows: (string | number)[][] = [
    ['REGISTRO DETALLADO DE VACUNOS CON NOVEDADES U OBSERVACIONES EN MANGA'],
    ['Establecimiento: ' + (session.campo || '-') + ' | Potrero: ' + (session.potrero || '-')],
    [],
    ['N°', 'Hora', 'Vacuno / Concepto', 'Cant.', 'Clasificación', 'Caravana / Marca', 'Observación / Motivo'],
  ];

  if (session.otherItems.length === 0) {
    otrosRows.push(['-', '-', 'No se registraron vacunos con observaciones en esta sesión', 0, '-', '-', '-']);
  } else {
    session.otherItems.forEach((item, idx) => {
      otrosRows.push([
        idx + 1,
        item.timeFormatted,
        item.animalName,
        item.quantity,
        item.classification,
        item.caravana || 'S/C',
        item.observation || 'Sin detalle adicional'
      ]);
    });
  }

  otrosRows.push(
    [],
    ['Total Vacunos con Novedades / Observaciones:', '', '', totalOtros]
  );

  const wsOtros = XLSX.utils.aoa_to_sheet(otrosRows);
  wsOtros['!cols'] = [
    { wch: 6 },
    { wch: 12 },
    { wch: 28 },
    { wch: 8 },
    { wch: 26 },
    { wch: 20 },
    { wch: 60 },
  ];

  XLSX.utils.book_append_sheet(wb, wsOtros, 'Detalle Otros y Notas');

  // Clean filename for Android download
  const safeCampo = (session.campo || 'Campo').replace(/[^a-zA-Z0-9_-]/g, '_');
  const safePotrero = (session.potrero || 'Potrero').replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeDate = session.fecha.replace(/[^a-zA-Z0-9_-]/g, '-');
  const fileName = `Conteo_${safeCampo}_${safePotrero}_${safeDate}.xlsx`;

  XLSX.writeFile(wb, fileName);
}

export function formatWhatsAppSummary(session: CountingSession): string {
  const totalVacunos = session.categories.reduce((acc, cat) => acc + cat.count, 0);
  const totalOtros = session.otherItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalGeneral = totalVacunos + totalOtros;

  let text = `📋 *CONTROL DE HACIENDA - CONTEO*\n`;
  if (session.campo) text += `📍 *Campo:* ${session.campo}\n`;
  if (session.potrero) text += `📌 *Potrero/Lote:* ${session.potrero}\n`;
  if (session.operador) text += `👤 *Operador:* ${session.operador}\n`;
  text += `📅 *Fecha:* ${session.fecha}\n`;
  text += `--------------------------------\n`;
  text += `🐂 *DETALLE VACUNO:*\n`;

  session.categories.forEach(cat => {
    if (cat.count > 0) {
      text += `• ${cat.name}: *${cat.count}*\n`;
    }
  });

  text += `👉 *Subtotal Vacunos:* ${totalVacunos} cab.\n`;
  text += `--------------------------------\n`;

  if (session.otherItems.length > 0) {
    text += `⚠️ *VACUNOS CON NOVEDAD / OBSERVACIÓN (${totalOtros}):*\n`;
    session.otherItems.forEach((item, i) => {
      text += `${i + 1}. *${item.animalName}* (x${item.quantity})\n`;
      if (item.observation) {
        text += `   📝 "${item.observation}"\n`;
      }
    });
    text += `--------------------------------\n`;
  }

  text += `🎯 *TOTAL VACUNOS:* *${totalGeneral} cabezas*\n`;
  text += `_Generado con Contador Ganadero Pro_`;

  return text;
}
