/**
 * FormInput Component
 * Reusable form input with validation and error display
 */

import { useId, useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export default function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  hint,
  disabled = false,
  showToggle = false,
  onBlur,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const inputId = id || `field-${generatedId}`;

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const hasError = !!error;
  const isValid = value && !error && type !== 'password';
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={[
            hasError ? errorId : null,
            hint && !hasError ? hintId : null,
          ]
            .filter(Boolean)
            .join(' ') || undefined}
          className={`w-full px-4 py-2 bg-slate-900 border rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none transition-colors ${
            hasError
              ? 'border-rose-500 focus:border-rose-500'
              : isValid
              ? 'border-emerald-500 focus:border-emerald-500'
              : 'border-slate-800 focus:border-amber-500'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />

        {/* Show/Hide Password Toggle */}
        {isPassword && showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
            tabIndex="-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {/* Success Icon */}
        {isValid && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500">
            <CheckCircle size={18} />
          </div>
        )}

        {/* Error Icon */}
        {hasError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-500">
            <AlertCircle size={18} />
          </div>
        )}
      </div>

      {/* Error Message */}
      {hasError && (
        <p id={errorId} className="text-sm text-rose-500 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      {/* Hint Text */}
      {hint && !hasError && (
        <p id={hintId} className="text-sm text-slate-400">{hint}</p>
      )}
    </div>
  );
}
