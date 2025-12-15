import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { FileUp, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface CsvUploaderProps {
  onDataLoaded: (data: any[], headers: string[]) => void;
}

export const CsvUploader: React.FC<CsvUploaderProps> = ({ onDataLoaded }) => {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setError(null);
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV file. Check format.');
          return;
        }
        if (results.data.length === 0) {
          setError('CSV file is empty.');
          return;
        }
        const headers = results.meta.fields || [];
        onDataLoaded(results.data, headers);
      },
      error: (err) => {
        setError(`Parse Error: ${err.message}`);
      }
    });
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div 
        className={`border-4 border-dashed rounded-3xl p-12 text-center transition-all duration-300 
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-blue-400'}
        `}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileUp size={40} />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          {fileName ? 'File Selected' : 'Drag & Drop your CSV file here'}
        </h3>
        <p className="text-slate-500 mb-8">
          {fileName ? fileName : 'or click below to browse from your computer'}
        </p>

        {fileName ? (
            <div className="flex items-center justify-center gap-2 text-green-600 font-medium bg-green-50 p-3 rounded-lg inline-block px-6">
                <CheckCircle size={20} />
                Ready to process
            </div>
        ) : (
            <label className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full cursor-pointer transition-colors shadow-lg hover:shadow-xl">
            Browse Files
            <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            />
            </label>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2 animate-pulse">
            <AlertCircle size={20} />
            {error}
          </div>
        )}
      </div>

      <div className="mt-12">
        <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <FileText size={20} />
            CSV Format Guide
        </h4>
        <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="py-2 px-4 font-semibold text-slate-600">Student Name</th>
                <th className="py-2 px-4 font-semibold text-slate-600">Roll No</th>
                <th className="py-2 px-4 font-semibold text-slate-600">Class</th>
                <th className="py-2 px-4 font-semibold text-slate-600">Math</th>
                <th className="py-2 px-4 font-semibold text-slate-600">Science</th>
                <th className="py-2 px-4 font-semibold text-slate-600">English</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-slate-500">
                <td className="py-2 px-4">John Doe</td>
                <td className="py-2 px-4">101</td>
                <td className="py-2 px-4">10-A</td>
                <td className="py-2 px-4">85</td>
                <td className="py-2 px-4">92</td>
                <td className="py-2 px-4">78</td>
              </tr>
              <tr className="text-slate-500 bg-slate-50/50">
                <td className="py-2 px-4">Jane Smith</td>
                <td className="py-2 px-4">102</td>
                <td className="py-2 px-4">10-A</td>
                <td className="py-2 px-4">90</td>
                <td className="py-2 px-4">88</td>
                <td className="py-2 px-4">95</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-3">
            * Columns can be in any order. You will map them in the next step.
          </p>
        </div>
      </div>
    </div>
  );
};