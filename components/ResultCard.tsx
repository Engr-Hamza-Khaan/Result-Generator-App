import React from 'react';
import { TemplateConfig, StudentData, FieldMapping, CalculatedResult } from '../types';
import { processStudentResult } from '../utils/gradeUtils';

interface ResultCardProps {
  config: TemplateConfig;
  student: StudentData;
  mapping: FieldMapping;
  id?: string;
  isExporting?: boolean; // New prop to adjust styles for PDF generation
}

export const ResultCard: React.FC<ResultCardProps> = ({ config, student, mapping, id, isExporting = false }) => {
  // If no mapping is done yet (preview mode in Step 1), show dummy data
  const isDummy = !mapping.nameField;
  
  const dummyStudent: StudentData = {
    name: 'John Doe',
    roll: '101',
    class: '10',
    sec: 'A',
    Math: '85',
    Science: '78',
    English: '92',
    History: '88',
    Computer: '95'
  };

  const dummyMapping: FieldMapping = {
    nameField: 'name',
    rollNoField: 'roll',
    classField: 'class',
    sectionField: 'sec',
    subjectFields: ['Math', 'Science', 'English', 'History', 'Computer']
  };

  const activeStudent = isDummy ? dummyStudent : student;
  const activeMapping = isDummy ? dummyMapping : mapping;

  const result: CalculatedResult = processStudentResult(activeStudent, activeMapping, config);

  return (
    <div
      id={id}
      className={`bg-white mx-auto overflow-hidden relative print:shadow-none print:m-0 ${isExporting ? '' : 'shadow-2xl'}`}
      style={{
        width: '210mm',
        minHeight: '297mm', // A4 Height
        padding: '20mm',
        color: '#1e293b', // slate-800
        fontFamily: 'serif' // Classic report card feel
      }}
    >
      {/* Border Decoration */}
      <div 
        className="absolute inset-0 pointer-events-none border-8"
        style={{ borderColor: config.primaryColor, margin: '10mm' }} 
      />

      {/* Header */}
      <header className="flex flex-col items-center justify-center border-b-2 pb-6 mb-8" style={{ borderColor: config.primaryColor }}>
        {config.logoUrl && (
          <img 
            src={config.logoUrl} 
            alt="School Logo" 
            className="h-24 w-auto mb-4 object-contain"
          />
        )}
        <h1 
          className="text-4xl font-bold text-center uppercase tracking-wide mb-2"
          style={{ color: config.primaryColor }}
        >
          {config.schoolName || 'School Name Here'}
        </h1>
        <p className="text-sm text-gray-500">{config.address || 'Address Line 1, City, State, Zip'}</p>
        <div className="mt-4 px-6 py-1 bg-gray-800 text-white rounded-full text-sm font-semibold uppercase tracking-wider">
          Annual Report Card
        </div>
      </header>

      {/* Student Details */}
      <section className="mb-8 grid grid-cols-2 gap-y-4 text-lg">
        <div className="flex">
          <span className="font-bold w-32 text-gray-600">Student Name:</span>
          <span className="font-semibold border-b border-gray-300 flex-1">{activeStudent[activeMapping.nameField] || '-'}</span>
        </div>
        <div className="flex">
          <span className="font-bold w-32 text-gray-600">Roll Number:</span>
          <span className="font-semibold border-b border-gray-300 flex-1">{activeStudent[activeMapping.rollNoField] || '-'}</span>
        </div>
        <div className="flex">
          <span className="font-bold w-32 text-gray-600">Class:</span>
          <span className="font-semibold border-b border-gray-300 flex-1">{activeStudent[activeMapping.classField] || '-'}</span>
        </div>
        <div className="flex">
          <span className="font-bold w-32 text-gray-600">Section:</span>
          <span className="font-semibold border-b border-gray-300 flex-1">{activeStudent[activeMapping.sectionField] || '-'}</span>
        </div>
      </section>

      {/* Marks Table */}
      <section className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-white" style={{ backgroundColor: config.primaryColor, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
              <th className="p-3 text-left border border-gray-300">Subject</th>
              <th className="p-3 text-center border border-gray-300 w-32">Max Marks</th>
              <th className="p-3 text-center border border-gray-300 w-32">Marks Obtained</th>
              {config.showGrade && <th className="p-3 text-center border border-gray-300 w-24">Grade</th>}
            </tr>
          </thead>
          <tbody>
            {result.subjects.map((subj, idx) => (
              <tr key={idx} className="even:bg-gray-50">
                <td className="p-3 border border-gray-300 font-medium">{subj.name}</td>
                <td className="p-3 border border-gray-300 text-center">{subj.maxMarks}</td>
                <td className="p-3 border border-gray-300 text-center font-bold">{subj.marks}</td>
                {config.showGrade && <td className="p-3 border border-gray-300 text-center">{subj.grade}</td>}
              </tr>
            ))}
            
            {/* Total Row */}
            <tr className="font-bold bg-gray-100 border-t-2 border-gray-400">
              <td className="p-3 border border-gray-300 text-right">Grand Total</td>
              <td className="p-3 border border-gray-300 text-center">{result.maxTotalMarks}</td>
              <td className="p-3 border border-gray-300 text-center">{parseFloat(result.totalMarks.toFixed(2))}</td>
              {config.showGrade && <td className="p-3 border border-gray-300 text-center"></td>}
            </tr>
          </tbody>
        </table>
      </section>

      {/* Summary / Result */}
      <section className="mb-12 flex justify-between items-stretch gap-8">
        <div className="flex-1 border rounded-lg p-4 bg-gray-50 flex flex-col justify-center">
          <h3 className="font-bold text-gray-600 mb-2 uppercase text-sm tracking-wider border-b pb-2">Performance Summary</h3>
          <div className="space-y-2 mt-2">
            {config.showPercentage && (
              <div className="flex justify-between">
                <span>Percentage:</span>
                <span className="font-bold">{result.percentage}%</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Overall Grade:</span>
              <span className="font-bold" style={{ color: config.primaryColor }}>{result.grade}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50 h-auto">
            <span className="text-sm font-bold text-gray-500 uppercase">Final Result</span>
            <span 
              className={`text-4xl font-bold mt-2 ${result.status === 'PASS' ? 'text-green-600' : 'text-red-600'}`}
            >
              {result.status}
            </span>
        </div>
      </section>

      {/* Footer Signatures */}
      <footer className="mt-auto grid grid-cols-3 gap-8 pt-12 items-end">
         <div className="text-center relative">
            <div className="h-20 mb-2 border-b border-gray-400 flex items-end justify-center">
                {config.classTeacherSignatureUrl && (
                  <img 
                    src={config.classTeacherSignatureUrl} 
                    alt="Class Teacher Signature" 
                    className="object-contain mb-1"
                    style={{ height: `${config.signatureHeight}px` }}
                  />
               )}
            </div>
            <p className="font-bold text-gray-600">Class Teacher</p>
         </div>
         <div className="text-center flex flex-col items-center justify-end">
             <div className="h-20 mb-2 flex items-end justify-center">
                {config.sealUrl ? (
                    <img 
                        src={config.sealUrl} 
                        alt="Seal" 
                        className="object-contain"
                        style={{ height: `${config.sealHeight}px` }}
                    />
                ) : (
                    <div className="h-16 w-16 rounded-full border-2 border-double border-gray-300 flex items-center justify-center text-xs text-gray-300 uppercase">
                        Seal
                    </div>
                )}
             </div>
         </div>
         <div className="text-center relative">
            <div className="h-20 mb-2 border-b border-gray-400 flex items-end justify-center">
               {config.signatureUrl && (
                  <img 
                    src={config.signatureUrl} 
                    alt="Principal Signature" 
                    className="object-contain mb-1" 
                    style={{ height: `${config.signatureHeight}px` }}
                  />
               )}
            </div>
            <p className="font-bold text-gray-600">Principal</p>
         </div>
      </footer>
      
      {/* Custom Footer Text */}
      <div className="mt-8 text-center text-xs text-gray-400">
        {config.footerText}
      </div>
    </div>
  );
};