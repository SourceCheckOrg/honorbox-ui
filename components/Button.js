export default function Button({ label, color, disabled = false, onClick }) {
    const bg = `${ disabled ? 'bg-gray-300' : 'bg-' + color + '-600' }`;
    const hoverBg = `${ disabled ? '' : 'hover:bg-' + color + '-700' }`;
    const cursor = `${ disabled ? 'cursor-default' : 'cursor-pointer' }`;
    return (
        <button
            type="button"
            className={`h-30 w-30 inline-flex justify-center py-2 px-4 mr-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${bg} ${hoverBg} ${cursor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            disabled={disabled}
            onClick={onClick}
        >
            {label}
        </button>
    );
}
