import React from 'react';
import { TemplateConfig, StudentData, FieldMapping } from '../types';
import { ResultCard } from './ResultCard';
import { Upload, Type, Palette, Layout, Stamp } from 'lucide-react';

interface TemplateBuilderProps {
  config: TemplateConfig;
  onChange: (newConfig: TemplateConfig) => void;
}

export const TemplateBuilder: React.FC<TemplateBuilderProps> = ({ config, onChange }) => {
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      onChange({ ...config, logoUrl: url });
    }
  };

  const handlePrincipalSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      onChange({ ...config, signatureUrl: url });
    }
  };

  const handleClassTeacherSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      onChange({ ...config, classTeacherSignatureUrl: url });
    }
  };

  const handleSealUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      onChange({ ...config, sealUrl: url });
    }
  };

  const dummyStudent = {} as StudentData; // Logic inside ResultCard handles empty/dummy data
  const dummyMapping = {} as FieldMapping;

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
      {/* Controls Sidebar */}
      <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-y-auto p-6 space-y-8 no-scrollbar">
        
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
            <Layout className="w-5 h-5 text-blue-600" />
            School Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">School Name</label>
              <input 
                type="text" 
                value={config.schoolName}
                onChange={(e) => onChange({...config, schoolName: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Ex. Springfiled High School"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address / Subtitle</label>
              <input 
                type="text" 
                value={config.address}
                onChange={(e) => onChange({...config, address: e.target.value})}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex. 123 Education Lane, NY"
              />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Logo</label>
                <div className="flex items-center gap-4">
                    {config.logoUrl && (
                        <img src={config.logoUrl} alt="Logo" className="w-12 h-12 object-contain border rounded" />
                    )}
                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-2 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 text-sm">
                        <Upload className="w-4 h-4" />
                        Upload Logo
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
            <Stamp className="w-5 h-5 text-blue-600" />
            Signatures & Seal
          </h3>
          <div className="space-y-4">
            {/* Principal Signature */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Principal Signature</label>
                <div className="flex items-center gap-4">
                    {config.signatureUrl && (
                        <img src={config.signatureUrl} alt="Signature" className="h-10 w-auto object-contain border rounded bg-white" />
                    )}
                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-2 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 text-sm">
                        <Upload className="w-4 h-4" />
                        Upload Principal Sig
                        <input type="file" accept="image/*" className="hidden" onChange={handlePrincipalSignatureUpload} />
                    </label>
                </div>
            </div>

            {/* Class Teacher Signature */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class Teacher Signature</label>
                <div className="flex items-center gap-4">
                    {config.classTeacherSignatureUrl && (
                        <img src={config.classTeacherSignatureUrl} alt="Signature" className="h-10 w-auto object-contain border rounded bg-white" />
                    )}
                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-2 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 text-sm">
                        <Upload className="w-4 h-4" />
                        Upload Teacher Sig
                        <input type="file" accept="image/*" className="hidden" onChange={handleClassTeacherSignatureUpload} />
                    </label>
                </div>
            </div>

             {/* Seal Upload */}
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">School Seal / Stamp</label>
                <div className="flex items-center gap-4">
                    {config.sealUrl && (
                        <img src={config.sealUrl} alt="Seal" className="h-10 w-auto object-contain border rounded bg-white" />
                    )}
                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-2 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 text-sm">
                        <Upload className="w-4 h-4" />
                        Upload Seal
                        <input type="file" accept="image/*" className="hidden" onChange={handleSealUpload} />
                    </label>
                </div>
            </div>

            {/* Size Controllers */}
            <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Signature Size</label>
                    <input 
                        type="range" 
                        min="20" 
                        max="120" 
                        value={config.signatureHeight} 
                        onChange={(e) => onChange({...config, signatureHeight: Number(e.target.value)})}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Seal Size</label>
                    <input 
                        type="range" 
                        min="40" 
                        max="150" 
                        value={config.sealHeight} 
                        onChange={(e) => onChange({...config, sealHeight: Number(e.target.value)})}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
            <Palette className="w-5 h-5 text-blue-600" />
            Appearance
          </h3>
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Theme Color</label>
                <div className="flex flex-wrap gap-3 items-center">
                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#1e293b'].map(color => (
                        <button
                            key={color}
                            onClick={() => onChange({...config, primaryColor: color})}
                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${config.primaryColor === color ? 'border-slate-800 ring-2 ring-offset-1 ring-slate-300' : 'border-transparent'}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-100 px-3 py-1 rounded-full border border-slate-200 hover:bg-slate-200 transition-colors">
                        <input 
                            type="color" 
                            value={config.primaryColor}
                            onChange={(e) => onChange({...config, primaryColor: e.target.value})}
                            className="w-6 h-6 rounded overflow-hidden border-0 p-0 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-medium text-slate-600">Custom</span>
                    </label>
                </div>
             </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
            <Type className="w-5 h-5 text-blue-600" />
            Display Options
          </h3>
          <div className="space-y-3">
             <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                <input 
                    type="checkbox" 
                    checked={config.showGrade}
                    onChange={(e) => onChange({...config, showGrade: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-slate-700 font-medium">Show Grades</span>
             </label>
             <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                <input 
                    type="checkbox" 
                    checked={config.showPercentage}
                    onChange={(e) => onChange({...config, showPercentage: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-slate-700 font-medium">Show Percentage</span>
             </label>
             <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Pass Marks (%)</label>
                 <input 
                    type="number" 
                    value={config.passMarks}
                    onChange={(e) => onChange({...config, passMarks: parseInt(e.target.value) || 0})}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                 />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Footer Text</label>
                <textarea 
                    value={config.footerText}
                    onChange={(e) => onChange({...config, footerText: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500 text-sm h-20"
                    placeholder="This document is computer generated..."
                />
             </div>
          </div>
        </div>

      </div>

      {/* Live Preview Area */}
      <div className="flex-1 bg-slate-200 rounded-xl overflow-auto p-8 flex justify-center items-start shadow-inner">
         <div className="scale-[0.6] origin-top md:scale-[0.7] lg:scale-[0.8] xl:scale-[0.9] transition-transform duration-300">
            <ResultCard config={config} student={dummyStudent} mapping={dummyMapping} />
         </div>
      </div>
    </div>
  );
};