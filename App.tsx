import React, { useState } from 'react';
import { TemplateConfig, AppStep, StudentData, FieldMapping } from './types';
import { TemplateBuilder } from './components/TemplateBuilder';
import { CsvUploader } from './components/CsvUploader';
import { FieldMapper } from './components/FieldMapper';
import { ResultPreview } from './components/ResultPreview';
import { LayoutTemplate, Upload, TableProperties, CheckCircle2, GraduationCap } from 'lucide-react';

const STEPS: { id: AppStep; label: string; icon: React.FC<any> }[] = [
  { id: 'TEMPLATE', label: 'Design Template', icon: LayoutTemplate },
  { id: 'UPLOAD', label: 'Upload Data', icon: Upload },
  { id: 'MAPPING', label: 'Map Fields', icon: TableProperties },
  { id: 'PREVIEW', label: 'Generate Results', icon: CheckCircle2 },
];

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('TEMPLATE');
  
  // State
  const [config, setConfig] = useState<TemplateConfig>({
    schoolName: 'Springfield Academy',
    address: '123 Education St, Knowledge City',
    logoUrl: null,
    signatureUrl: null,
    classTeacherSignatureUrl: null,
    sealUrl: null,
    signatureHeight: 60, // Default height in px
    sealHeight: 80, // Default height in px
    footerText: 'This result is computer generated and does not require a signature.',
    primaryColor: '#3b82f6', // blue-500
    showGrade: true,
    showPercentage: true,
    passMarks: 40
  });

  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  
  const [mapping, setMapping] = useState<FieldMapping>({
    nameField: '',
    rollNoField: '',
    classField: '',
    sectionField: '',
    subjectFields: []
  });

  const handleDataLoaded = (data: any[], headers: string[]) => {
    setStudentData(data);
    setCsvHeaders(headers);
    setCurrentStep('MAPPING');
  };

  const getStepIndex = (step: AppStep) => STEPS.findIndex(s => s.id === step);
  const currentStepIdx = getStepIndex(currentStep);

  const canProceed = () => {
    if (currentStep === 'TEMPLATE') return config.schoolName.length > 0;
    if (currentStep === 'UPLOAD') return studentData.length > 0;
    if (currentStep === 'MAPPING') return mapping.nameField && mapping.subjectFields.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">GradeGenius</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            {STEPS.map((step, idx) => {
               const isActive = step.id === currentStep;
               const isCompleted = idx < currentStepIdx;
               const Icon = step.icon;
               
               return (
                 <React.Fragment key={step.id}>
                   <div 
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${isActive ? 'bg-blue-50 text-blue-700' : isCompleted ? 'text-green-600' : 'text-slate-400'}
                      `}
                   >
                     <Icon size={18} />
                     {step.label}
                   </div>
                   {idx < STEPS.length - 1 && <div className="w-8 h-px bg-slate-200" />}
                 </React.Fragment>
               )
            })}
          </nav>

          <div>
             {/* Placeholder for user profile or extra actions */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {currentStep === 'TEMPLATE' && (
            <TemplateBuilder config={config} onChange={setConfig} />
        )}

        {currentStep === 'UPLOAD' && (
            <CsvUploader onDataLoaded={handleDataLoaded} />
        )}

        {currentStep === 'MAPPING' && (
            <FieldMapper headers={csvHeaders} mapping={mapping} onChange={setMapping} />
        )}

        {currentStep === 'PREVIEW' && (
            <ResultPreview data={studentData} mapping={mapping} config={config} />
        )}

      </main>

      {/* Footer Navigation */}
      <footer className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button 
                onClick={() => setCurrentStep(STEPS[currentStepIdx - 1].id)}
                disabled={currentStepIdx === 0}
                className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
                Back
            </button>
            
            {currentStep !== 'PREVIEW' && (
                <button 
                    onClick={() => setCurrentStep(STEPS[currentStepIdx + 1].id)}
                    disabled={!canProceed()}
                    className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none disabled:active:scale-100"
                >
                    Continue
                </button>
            )}
        </div>
      </footer>

    </div>
  );
}

export default App;