'use client';

import jsPDF from 'jspdf';
import type { Script, Scene } from './types';

function addWrappedText({
  doc,
  text,
  x,
  maxWidth,
  y,
  font,
  style,
  size
}: {
  doc: jsPDF;
  text: string;
  x: number;
  maxWidth: number;
  y: number;
  font: string;
  style: string;
  size: number;
}) {
  doc.setFont(font, style);
  doc.setFontSize(size);
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * (size * 0.4); // Approx line height
}

export function exportScriptToPDF(script: Script) {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let y = margin;

  y = addWrappedText({ doc, text: script.title, x: 105, maxWidth: 180, y, font: 'times', style: 'bold', size: 24 });
  y+= 5;
  doc.text(`By User`, 105, y, { align: 'center' });
  y += 20;

  script.scenes.forEach(scene => {
    const sceneHeader = `${scene.sceneNumber}. ${scene.location.toUpperCase()} - ${scene.timeOfDay.toUpperCase()}`;
    
    if (y > pageHeight - margin * 3) {
      doc.addPage();
      y = margin;
    }
    
    y = addWrappedText({ doc, text: sceneHeader, x: margin, maxWidth: 170, y, font: 'courier', style: 'bold', size: 12 });
    y += 5;

    y = addWrappedText({ doc, text: scene.description, x: margin, maxWidth: 170, y, font: 'courier', style: 'normal', size: 12 });
    y += 5;

    // Simple dialogue parsing
    const dialogueParts = scene.dialogue.split(/\\n/g).filter(line => line.trim() !== '');
    dialogueParts.forEach(line => {
      const isCharacter = line.trim().toUpperCase() === line.trim() && !line.includes('(') && line.length < 30;
      if (isCharacter) {
        y = addWrappedText({ doc, text: line.trim(), x: 70, maxWidth: 100, y: y+5, font: 'courier', style: 'normal', size: 12 });
      } else {
         y = addWrappedText({ doc, text: line.trim(), x: 50, maxWidth: 120, y, font: 'courier', style: 'normal', size: 12 });
      }
    });

    y += 15;
  });

  doc.save(`${script.title.replace(/\s+/g, '_')}.pdf`);
}
