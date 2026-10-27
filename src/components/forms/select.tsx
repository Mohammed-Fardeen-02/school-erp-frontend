import * as React from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: { target: { name?: string; value: string } }) => void;
  onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  className?: string;
  error?: boolean;
  placeholder?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  label?: string;
}

export const Select: React.FC<SelectProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  className,
  error,
  placeholder = 'Select...',
  children,
  disabled,
  label,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const options = React.useMemo(() => {
    const opts: SelectOption[] = [];
    React.Children.forEach(children, child => {
      if (React.isValidElement(child)) {
        const props = child.props as { value?: string | number; children?: React.ReactNode };
        opts.push({
          value: String(props.value !== undefined ? props.value : ''),
          label: String(props.children || ''),
        });
      }
    });
    return opts;
  }, [children]);

  const selectedOption = options.find(opt => opt.value === value);

  React.useEffect(() => {
    if (!isOpen) return;
    const update = () => {
      if (buttonRef.current) setRect(buttonRef.current.getBoundingClientRect());
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (optValue: string) => {
    if (onChange) {
      onChange({ target: { name, value: optValue } });
    }
    setIsOpen(false);
  };

  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
      <button
        ref={buttonRef}
        id={id}
        name={name}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        onBlur={onBlur}
        className={cn(
          'flex h-9 w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/20',
          disabled && 'cursor-not-allowed opacity-50',
          error && 'border-danger focus:border-danger focus:ring-danger/20',
          isOpen && 'border-primary ring-2 ring-primary/20',
          className
        )}
      >
        <span className={cn('truncate', !selectedOption && 'text-muted-foreground')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen &&
        rect &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: rect.bottom + 4,
              left: rect.left,
              width: rect.width,
              zIndex: 9999,
            }}
            className="max-h-60 overflow-y-auto rounded-xl border border-border bg-surface p-1 shadow-xl animate-in fade-in-0 zoom-in-95"
          >
            {options.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">No options available</div>
            ) : (
              options.map(opt => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors text-left',
                      isSelected
                        ? 'bg-primary text-white font-medium'
                        : 'text-foreground hover:bg-surface-muted hover:text-primary'
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 ml-2" />}
                  </button>
                );
              })
            )}
          </div>,
          document.body
        )}
    </div>
  );
};
