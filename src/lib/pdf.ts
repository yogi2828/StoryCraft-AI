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

  // Title Page
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.text(script.title, 105, 120, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`By ${script.userId}`, 105, 130, { align: 'center' });
  
  doc.addPage();
  y = margin;

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

    // Improved dialogue parsing
    const dialogueLines = scene.dialogue.split('\n').filter(line => line.trim() !== '');
    dialogueLines.forEach(line => {
        line = line.trim();
        const isCharacter = line.toUpperCase() === line && !line.includes('(') && !/\d/.test(line) && line.length > 1 && line.length < 35;
        const isParenthetical = line.startsWith('(') && line.endsWith(')');

        if (y > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }

        if (isCharacter) {
            y = addWrappedText({ doc, text: line, x: 80, maxWidth: 100, y: y + 4, font: 'courier', style: 'normal', size: 12 });
        } else if (isParenthetical) {
            y = addWrappedText({ doc, text: line, x: 65, maxWidth: 80, y, font: 'courier', style: 'normal', size: 12 });
        } else { // Dialogue
            y = addWrappedText({ doc, text: line, x: 50, maxWidth: 110, y, font: 'courier', style: 'normal', size: 12 });
        }
    });

    y += 15;
  });

  doc.save(`${script.title.replace(/\s+/g, '_')}.pdf`);
}
