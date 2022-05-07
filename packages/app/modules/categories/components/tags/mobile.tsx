import { useState, ChangeEvent } from 'react';
import { HiAdjustments } from 'react-icons/hi';
import Error from '../../../common/components/error';

interface TagsFilterMobileProps {
  value: string[];
  error?: Error | null;
  options?: string[];
  onChange: (value: string[]) => void;
}

const TagsFilterMobile = ({ value, options, error, onChange }: TagsFilterMobileProps) => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  if (error) return <Error error={error} />;

  const handler = (e: ChangeEvent<HTMLInputElement>) => {
    const set = new Set(value);
    e.target.checked ? set.add(e.target.name) : set.delete(e.target.name);
    onChange(Array.from(set));
  }

  return (
    <div className="py-1 lg:hidden">
      <button className='hover:text-blue-700'>
        <HiAdjustments size={24} onClick={() => setCategoriesOpen(true)} />
      </button>
      <div
        className={`fixed top-0 bottom-0 left-0 right-0 bg-opacity-50 bg-black z-40 transition-opacity ${categoriesOpen ? 'opacity-100' : 'hidden'}`}
        onClick={() => setCategoriesOpen(false)}
      />
      <div className={`fixed w-3/4 bg-gray-100 top-0 right-0 bottom-0 z-50 transition-transform ${categoriesOpen ? '' : 'translate-x-full'}`}>
        <h4 className='py-1 px-2 mb-1 font-semibold'>Категории</h4>
        <ul className='overflow-y-auto h-96 scrollbar px-2' >
          {(options || []).map(tag => (
            <li key={tag}>
              <label className='flex items-center space-x-2'>
                <input
                  type="checkbox"
                  name={tag}
                  onChange={handler}
                  checked={value.includes(tag)}
                  className='h-4 w-4 rounded border border-gray-300 checked:bg-blue-500 checked:border-transparent focus:outline-none'
                />
                <span>{tag}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className='text-right p-2'>
          <a className={`hover:text-blue-700 cursor-pointer text-sm ${value.length ? '' : 'hidden'}`} onClick={() => onChange([])} >Очистить</a>
        </p>
        <div className='absolute left-0 right-0 bottom-0 p-2 '>
          <button className='w-full rounded py-2 text-white bg-gray-700' onClick={() => setCategoriesOpen(false)}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default TagsFilterMobile;
