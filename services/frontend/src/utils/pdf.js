import { jsPDF } from "jspdf";

export function exportVerificationPdf(data) {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.text("Lottery Draw Verification", 20, 20);
  doc.setFont("helvetica", "normal");
  doc.text(`Draw Hash: ${data.drawHash}`, 20, 40);
  doc.text(`Certified: ${data.certified ? "Yes" : "No"}`, 20, 50);
  doc.text(`Transaction: ${data.transactionHash || "N/A"}`, 20, 60);
  doc.save("draw-verification.pdf");
}
