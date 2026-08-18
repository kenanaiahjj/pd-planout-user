import React from 'react';

interface FormTextFieldProps {
  label: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: React.InputHTMLAttributes<HTMLInputElement>['autoComplete'];
  enterKeyHint?: React.InputHTMLAttributes<HTMLInputElement>['enterKeyHint'];
  name?: string;
  id?: string;
  onChange?: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  className?: string;
  labelClassName?: string;
  frameClassName?: string;
  inputClassName?: string;
  highlight?: 'warning';
  autoFocus?: boolean;
  disabled?: boolean;
}

interface FormTextareaProps {
  label: string;
  required?: boolean;
  value?: string;
  placeholder: string;
  inputMode?: React.TextareaHTMLAttributes<HTMLTextAreaElement>['inputMode'];
  autoComplete?: React.TextareaHTMLAttributes<HTMLTextAreaElement>['autoComplete'];
  enterKeyHint?: React.TextareaHTMLAttributes<HTMLTextAreaElement>['enterKeyHint'];
  name?: string;
  id?: string;
  onChange?: (value: string) => void;
  className?: string;
  labelClassName?: string;
  frameClassName?: string;
  textareaClassName?: string;
  rows?: number;
  disabled?: boolean;
}

export function FormTextField({
  label,
  required,
  value,
  defaultValue,
  placeholder,
  type = 'text',
  inputMode,
  autoComplete,
  enterKeyHint,
  name,
  id,
  onChange,
  onKeyDown,
  className = '',
  labelClassName = '',
  frameClassName = '',
  inputClassName = '',
  highlight,
  autoFocus,
  disabled,
}: FormTextFieldProps) {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;
  const frameClass =
    highlight === 'warning'
      ? 'border-[#f59e0b]/35 bg-[#fffbeb]/70 focus-within:ring-[#f59e0b]/20 focus-within:border-[#f59e0b]'
      : 'border-slate-200/80 bg-white focus-within:ring-[#177564]/15 focus-within:border-[#177564]';

  return (
    <div className={`form-text-field flex flex-col gap-1.5 group ${className}`}>
      <label htmlFor={fieldId} className={`form-text-field__label text-[13px] font-semibold tracking-tight text-[#344054] transition-colors duration-200 group-focus-within:text-[#177564] ${labelClassName}`}>
        {label}
        {required && <span className="ml-0.5 text-[#dc2626]">*</span>}
      </label>
      <div className={`form-text-field__frame rounded-[10px] border px-3.5 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all duration-200 focus-within:ring-2 ${frameClass} ${frameClassName}`}>
        <input
          id={fieldId}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          enterKeyHint={enterKeyHint}
          {...(value !== undefined ? { value } : {})}
          {...(defaultValue !== undefined ? { defaultValue } : {})}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          className={`native-mobile-field form-text-field__input w-full min-w-0 bg-transparent text-[14px] text-[#181d27] placeholder:text-[#94a3b8] focus:outline-none disabled:cursor-not-allowed disabled:text-slate-400 ${inputClassName}`}
        />
      </div>
    </div>
  );
}

export function FormTextarea({
  label,
  required,
  value,
  placeholder,
  inputMode,
  autoComplete,
  enterKeyHint,
  name,
  id,
  onChange,
  className = '',
  labelClassName = '',
  frameClassName = '',
  textareaClassName = '',
  rows = 3,
  disabled,
}: FormTextareaProps) {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;
  return (
    <div className={`form-text-field flex flex-col gap-1.5 group ${className}`}>
      <label htmlFor={fieldId} className={`form-text-field__label text-[13px] font-semibold tracking-tight text-[#344054] transition-colors duration-200 group-focus-within:text-[#177564] ${labelClassName}`}>
        {label}
        {required && <span className="ml-0.5 text-[#dc2626]">*</span>}
      </label>
      <div className={`form-text-field__frame rounded-[10px] border border-slate-200/80 bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all duration-200 focus-within:ring-2 focus-within:ring-[#177564]/15 focus-within:border-[#177564] ${frameClassName}`}>
        <textarea
          id={fieldId}
          name={name}
          value={value}
          inputMode={inputMode}
          autoComplete={autoComplete}
          enterKeyHint={enterKeyHint}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`native-mobile-field form-textarea__input w-full min-w-0 resize-none bg-transparent text-[14px] text-[#181d27] placeholder:text-[#94a3b8] focus:outline-none disabled:cursor-not-allowed disabled:text-slate-400 ${textareaClassName}`}
        />
      </div>
    </div>
  );
}
