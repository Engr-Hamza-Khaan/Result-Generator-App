import { CalculatedResult, FieldMapping, StudentData, TemplateConfig } from '../types';

export const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

export const processStudentResult = (
  student: StudentData,
  mapping: FieldMapping,
  config: TemplateConfig
): CalculatedResult => {
  let totalObtained = 0;
  let totalMax = 0;
  const processedSubjects: CalculatedResult['subjects'] = [];

  mapping.subjectFields.forEach((subjectKey) => {
    const marksStr = student[subjectKey];
    // Remove non-numeric chars except dot
    const cleanMarks = marksStr ? marksStr.replace(/[^\d.]/g, '') : '0';
    const marks = parseFloat(cleanMarks) || 0;
    const maxMarks = 100; // Default max marks per subject

    totalObtained += marks;
    totalMax += maxMarks;

    processedSubjects.push({
      name: subjectKey, // Using CSV header as subject name
      marks,
      maxMarks,
      grade: calculateGrade((marks / maxMarks) * 100),
    });
  });

  const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
  const grade = calculateGrade(percentage);
  
  // Simple pass/fail logic: Must pass aggregate or per subject? 
  // For this generic app, we'll use aggregate percentage vs passMarks from config (converted to %) 
  // OR strictly check if percentage >= 40 (standard). 
  // Using config.passMarks as the threshold for passing (e.g. 40).
  const status = percentage >= config.passMarks ? 'PASS' : 'FAIL';

  return {
    totalMarks: totalObtained,
    maxTotalMarks: totalMax,
    percentage: parseFloat(percentage.toFixed(2)),
    grade,
    status,
    subjects: processedSubjects,
  };
};