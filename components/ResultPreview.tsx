import React, { useState, useRef, useEffect } from 'react';
import { TemplateConfig, StudentData, FieldMapping } from '../types';
import { ResultCard } from './ResultCard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { Download, ChevronLeft, ChevronRight, Loader2, Printer, FileArchive } from 'lucide-react';

interface ResultPreviewProps {
  data: StudentData[];
  mapping: FieldMapping;
  config: TemplateConfig;
}

export const ResultPreview: React.FC<ResultPreviewProps> = ({ data, mapping, config }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // States for export process
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  
  // This state controls what is currently rendered in the hidden "Export Container"
  const [exportStudentIndex, setExportStudentIndex] = useState<number | null>(null);
  
  // Refs to manage the zip object and process loop across renders
  const zipRef = useRef<JSZip | null>(null);
  const isBulkRef = useRef(false);

  const totalStudents = data.length;
  const currentStudent = data[currentIndex];

  const handleNext = () => setCurrentIndex(prev => Math.min(prev + 1, totalStudents - 1));
  const handlePrev = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

  // --- PDF GENERATION LOGIC ---

  const capturePdf = async (element: HTMLElement, fileName: string): Promise<Blob | null> => {
    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff', // Ensure white background
            width: 794, // Exact A4 width in px at 96 DPI
            height: 1123, // Exact A4 height
            windowWidth: 1024, // Simulate desktop browser for correct layout
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = 210;
        const pdfHeight = 297;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        return pdf.output('blob');
    } catch (error) {
        console.error("Error generating PDF:", error);
        return null;
    }
  };

  const startSingleDownload = () => {
    setIsExporting(true);
    isBulkRef.current = false;
    setExportStatus('Generating PDF...');
    // Set the export index to current viewed student to trigger the useEffect
    setExportStudentIndex(currentIndex); 
  };

  const startBulkDownload = () => {
    setIsExporting(true);
    isBulkRef.current = true;
    setExportStatus('Initializing Bulk Export...');
    setExportProgress(0);
    zipRef.current = new JSZip();
    // Start from the first student
    setExportStudentIndex(0);
  };

  // This Effect watches `exportStudentIndex`. 
  // When it changes, it means the Hidden Export Container has (hopefully) re-rendered with new data.
  // We wait a tick, then capture.
  useEffect(() => {
    if (exportStudentIndex === null) return;

    const processExport = async () => {
      const element = document.getElementById('export-container');
      if (!element) {
          console.error("Export container not found");
          setIsExporting(false);
          setExportStudentIndex(null);
          return;
      }

      // Small delay to ensure React has fully committed DOM changes and images are ready
      await new Promise(resolve => setTimeout(resolve, 150));

      const student = data[exportStudentIndex];
      const safeName = (student[mapping.nameField] || `Student_${exportStudentIndex + 1}`).replace(/[^a-z0-9]/gi, '_');
      const fileName = `${safeName}.pdf`;

      if (isBulkRef.current) {
         setExportStatus(`Processing ${exportStudentIndex + 1}/${totalStudents}: ${safeName}`);
         const blob = await capturePdf(element, fileName);
         
         if (blob && zipRef.current) {
            zipRef.current.file(fileName, blob);
         }

         const nextIndex = exportStudentIndex + 1;
         const percent = Math.round((nextIndex / totalStudents) * 100);
         setExportProgress(percent);

         if (nextIndex < totalStudents) {
             // Move to next student
             setExportStudentIndex(nextIndex);
         } else {
             // Finished
             setExportStatus('Compressing files...');
             const content = await zipRef.current?.generateAsync({ type: 'blob' });
             if (content) {
                 const link = document.createElement('a');
                 link.href = URL.createObjectURL(content);
                 link.download = `Result_Cards_Bulk.zip`;
                 link.click();
             }
             setIsExporting(false);
             setExportStudentIndex(null);
             zipRef.current = null;
         }

      } else {
         // Single Download Mode
         const blob = await capturePdf(element, fileName);
         if (blob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
         }
         setIsExporting(false);
         setExportStudentIndex(null);
      }
    };

    processExport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exportStudentIndex]);


  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6 relative">
      
      {/* --- HIDDEN EXPORT CONTAINER --- */}
      {/* This renders the card at exact A4 dimensions off-screen for capture */}
      <div 
         style={{ 
             position: 'fixed', 
             top: '-10000px', 
             left: '-10000px', 
             width: '210mm', 
             height: '297mm',
             overflow: 'hidden'
         }}
      >
         <div id="export-container">
             {exportStudentIndex !== null && data[exportStudentIndex] && (
                 <ResultCard 
                    config={config} 
                    student={data[exportStudentIndex]} 
                    mapping={mapping}
                    isExporting={true} 
                 />
             )}
         </div>
      </div>

      {/* --- OVERLAY FOR EXPORT PROGRESS --- */}
      {isExporting && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
              <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full text-center">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{exportStatus}</h3>
                  {isBulkRef.current && (
                      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
                          <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${exportProgress}%` }}></div>
                      </div>
                  )}
                  <p className="text-slate-500 text-sm">Please do not close this window.</p>
              </div>
          </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
         <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">Preview Results</h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Student {currentIndex + 1} of {totalStudents}
            </span>
         </div>
         
         <div className="flex items-center gap-3">
             <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-4">
                <button 
                    onClick={handlePrev}
                    disabled={currentIndex === 0 || isExporting}
                    className="p-2 hover:bg-white rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <ChevronLeft size={20} />
                </button>
                <span className="w-24 text-center font-medium text-sm text-slate-600">
                   {currentIndex + 1} / {totalStudents}
                </span>
                <button 
                    onClick={handleNext}
                    disabled={currentIndex === totalStudents - 1 || isExporting}
                    className="p-2 hover:bg-white rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <ChevronRight size={20} />
                </button>
             </div>

             <button 
                onClick={startSingleDownload}
                disabled={isExporting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all active:scale-95 disabled:bg-blue-400"
             >
                <Download size={18} />
                Download PDF
             </button>

             <button 
                onClick={startBulkDownload}
                disabled={isExporting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all active:scale-95 disabled:bg-green-400"
                title="Download all as ZIP"
             >
                <FileArchive size={18} />
                Bulk Download
             </button>
             
             <button
                onClick={() => window.print()}
                disabled={isExporting}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all active:scale-95"
             >
                <Printer size={18} />
                Print
             </button>
         </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-slate-500 rounded-xl overflow-auto p-8 flex justify-center shadow-inner relative">
         {/* We render the card here scaled down for preview */}
         <div className="scale-[0.6] origin-top md:scale-[0.7] xl:scale-[0.85] transition-transform duration-300">
             <div className="shadow-2xl">
                 <ResultCard 
                    config={config} 
                    student={currentStudent} 
                    mapping={mapping} 
                 />
             </div>
         </div>
      </div>
    </div>
  );
};