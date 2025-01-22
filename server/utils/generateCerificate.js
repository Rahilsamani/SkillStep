const PDFDocument = require("pdfkit");

exports.generateCertificate = (user, course) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // Add certificate content
      doc.fontSize(24).text("SkillStep", { align: "center", color: "blue" });
      doc.fontSize(18).text("Certificate of Completion", { align: "center" });
      doc.moveDown();
      doc.fontSize(16).text(`This certifies that`, { align: "center" });
      doc.fontSize(20).text(`${user.firstName} ${user.lastName}`, {
        align: "center",
        bold: true,
      });
      doc.moveDown();
      doc
        .fontSize(16)
        .text(`has successfully completed the course`, { align: "center" });
      doc.fontSize(20).text(`${course.title}`, { align: "center", bold: true });
      doc.moveDown();
      doc
        .fontSize(14)
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
