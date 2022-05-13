import { HiMinus, HiPlus } from 'react-icons/hi';

interface QtyInputProps {
  value: number;
  onChange: (qty: number) => void;
}

const QtyInput = ({ value, onChange }: QtyInputProps) => {
  return (
    <div className="rounded flex bg-neutral-200 min-w-0 grow">
      <button className='p-2' onClick={() => value - 1 > 0 ? onChange(value - 1) : 1}>
        <HiMinus />
      </button>

      <input
        type="number"
        min={1}
        value={value}
        className='p-2 bg-neutral-200 outline-none spin-btn-none min-w-0 text-center grow'
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />

      <button className='p-2' onClick={() => onChange(value + 1)}>
        <HiPlus />
      </button>
    </div>
  );
}

export default QtyInput;
