function renderOptions(options, valueField, labelField ) {
  return options.map(option => {
    return <option key={option[valueField]} value={option[valueField]}>{option[labelField]}</option>
  });
}

export default function SelectField({ options=[], valueField, labelField, selected, onChange }) {
  return (
    <select 
      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      value={selected || ''}
      onChange={evt => {
        const newValue = evt.target.value;
        onChange(newValue !== '' ? newValue : null);
      }}>
      <option value=''></option>
      { renderOptions(options, valueField, labelField) }
    </select>
  );
}
