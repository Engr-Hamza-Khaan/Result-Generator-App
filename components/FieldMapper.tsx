import React from 'react';
import { FieldMapping } from '../types';
import { ArrowRightLeft } from 'lucide-react';

interface FieldMapperProps {
  headers: string[];
  mapping: FieldMapping;
  onChange: (mapping: FieldMapping) => void;
}

export const FieldMapper: React.FC<FieldMapperProps> = ({ headers, mapping, onChange }) => {
  
  const handleSubjectToggle = (header: string) => {
    const currentSubjects = mapping.subjectFields || [];
    if (currentSubjects.includes(header)) {
      onChange({
        ...mapping,
        subjectFields: currentSubjects.filter(h => h !== header)
      });
    } else {
      onChange({
        ...mapping,
        subjectFields: [...currentSubjects, header]
      });
    }
  };

  const SelectInput = ({ label, value, fieldKey }: { label: string, value: string, fieldKey: keyof Omit<FieldMapping, 'subjectFields'> }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange({...mapping, [fieldKey]: e.target.value})}
        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">-- Select Column --</option>
        {headers.map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Map Your Data</h2>
        <p className="text-slate-500">Connect your CSV columns to the report card fields.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <SelectInput label="Student Name" value={mapping.nameField} fieldKey="nameField" />
        <SelectInput label="Roll Number" value={mapping.rollNoField} fieldKey="rollNoField" />
        <SelectInput label="Class" value={mapping.classField} fieldKey="classField" />
        <SelectInput label="Section" value={mapping.sectionField} fieldKey="sectionField" />
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-blue-600" />
            Select Subjects & Marks Columns
        </h3>
        <p className="text-sm text-slate-500 mb-6">
            Check the columns that contain subject marks. These will appear in the result table.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {headers.map(header => {
                const isSelected = mapping.subjectFields.includes(header);
                // Simple heuristic to disable standard fields selection in subjects to avoid duplicates
                const isStandardField = [mapping.nameField, mapping.rollNoField, mapping.classField, mapping.sectionField].includes(header);

                return (
                    <label 
                        key={header} 
                        className={`
                            flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                            ${isSelected ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}
                            ${isStandardField ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <input 
                            type="checkbox" 
                            checked={isSelected}
                            disabled={isStandardField}
                            onChange={() => handleSubjectToggle(header)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                            {header}
                        </span>
                    </label>
                )
            })}
        </div>
      </div>
    </div>
  );
};