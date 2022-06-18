import { ChangeEvent } from 'react';

interface TagsFilterProps {
  value: string[];
  options?: string[];
  onChange: (value: string[]) => void;
}

const TagsFilter = ({ value, options, onChange }: TagsFilterProps) => {
  const handler = (e: ChangeEvent<HTMLInputElement>) => {
    const set = new Set(value);
    e.target.checked ? set.add(e.target.name) : set.delete(e.target.name);
    onChange(Array.from(set));
  }

  return (
    <div>
      <h4 className='py-1 mb-1 font-semibold'>Категории</h4>
      {!options?.length && (<p>Нет категорий</p>)}
      <ul className='overflow-y-auto h-96 scrollbar' >
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
    </div>
  );
};

export default TagsFilter;
