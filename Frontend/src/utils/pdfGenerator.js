import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (records) => {
  const doc = new jsPDF();
  doc.text('Attendance Report', 20, 10);
  autoTable(doc, {
    head: [['Date', 'Student Name', 'Roll Number', 'Class', 'Subject', 'Status']],
    body: records.map(record => [
      new Date(record.date).toLocaleDateString(),
      record.studentName,
      record.rollNumber,
      record.className,
      record.subjectName,
      record.status,
    ]),
  });
  doc.save('attendance-report.pdf');
};

export const generateAbsenteesPDF = (records) => {
    const doc = new jsPDF();
    doc.text('Absentees Report', 20, 10);
    autoTable(doc, {
      head: [['Date', 'Student Name', 'Roll Number', 'Class', 'Subject']],
      body: records
        .filter(record => record.status === 'Absent')
        .map(record => [
          new Date(record.date).toLocaleDateString(),
          record.studentName,
          record.rollNumber,
          record.className,
          record.subjectName,
        ]),
    });
    doc.save('absentees-report.pdf');
  };