import { useRef, useEffect, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

const Select = ({ value, options, onChange }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Element)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const current = options.find((option) => option.value === value);
  if (!current) throw new Error('Select component must have active option');

  const onClick = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className='relative py-1 inline-block'>
      <div onClick={() => setIsOpen(true)} className='flex items-center cursor-default'>
        <span>{current.label}</span>
        <span className='ml-2 pt-1'>
          <HiChevronDown />
        </span>
      </div>
      <ul className={`absolute border top-full left-0 z-10 bg-white py-1 rounded ${isOpen ? '' : 'hidden'}`}>
        {options.map(({ value, label }) => (
          <li
            key={value}
            onClick={() => onClick(value)}
            className='hover:bg-blue-500 hover:text-white px-2 py-1 cursor-default whitespace-nowrap'
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Select;
