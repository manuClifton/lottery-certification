import { jsPDF } from "jspdf";

function buildVerificationPdf(data) {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.text("Certificacion de Sorteo", 20, 20);
  doc.setFont("helvetica", "normal");
  doc.text(`Nombre de archivo: ${data.fileName || "N/D"}`, 20, 40);
  doc.text(`Hash del sorteo: ${data.drawHash}`, 20, 50);
  doc.text(`Certificado: ${data.certified ? "Si" : "No"}`, 20, 60);
  doc.text(`Hash de transaccion: ${data.transactionHash || "N/D"}`, 20, 70);
  doc.text(`Fecha: ${data.createdAt || new Date().toLocaleString("es-AR")}`, 20, 80);
  return doc;
}

export function exportVerificationPdf(data, fileName = "certificacion-sorteo.pdf") {
  const doc = buildVerificationPdf(data);
  doc.save(fileName);
}

export function createVerificationPdfUrl(data) {
  const doc = buildVerificationPdf(data);
  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
}
