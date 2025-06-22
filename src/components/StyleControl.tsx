import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StyleControlProps {
  label: string;
  value?: string | number;
  unit?: string;
  children: ReactNode;
  className?: string;
}

export function StyleControl({ label, value, unit, children, className = "" }: StyleControlProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {value !== undefined && (
          <span className="text-blue-400 ml-1">
            {value}{unit}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

interface StyleSectionProps {
  title: string;
  icon?: string;
  children: ReactNode;
  className?: string;
}

export function StyleSection({ title, icon, children, className = "" }: StyleSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-750/50 backdrop-blur-sm rounded-lg p-4 border border-gray-600/50 ${className}`}
    >
      <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h4>
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );
}

interface StyleSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
}

export function StyleSelect({ value, onChange, options, disabled = false }: StyleSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface StyleSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
}

export function StyleSlider({ value, onChange, min, max, step = 1, disabled = false }: StyleSliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      disabled={disabled}
      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed slider"
    />
  );
}

interface StyleColorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function StyleColor({ value, onChange, disabled = false }: StyleColorProps) {
  return (
    <div className="relative">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full h-10 border border-gray-600 rounded-md bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      />
      <div 
        className="absolute inset-0 rounded-md border border-gray-600 pointer-events-none"
        style={{ backgroundColor: value }}
      />
    </div>
  );
}

interface StyleToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id: string;
}

export function StyleToggle({ checked, onChange, label, id }: StyleToggleProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <label
          htmlFor={id}
          className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
            checked ? 'bg-blue-500' : 'bg-gray-600'
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              checked ? 'transform translate-x-6' : ''
            }`}
          />
        </label>
      </div>
      <label htmlFor={id} className="text-sm font-medium text-gray-300 cursor-pointer">
        {label}
      </label>
    </div>
  );
}