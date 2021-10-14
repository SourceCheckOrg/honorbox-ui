import PulseLoader from 'react-spinners/PulseLoader';

export default function LoaderButton({ color, loading, hidden = false }) {
  const bg = `bg-${color}-600`;
  const hoverBg = `hover:bg-${color}-700`;
  return (
    <div className={`${hidden ? 'hidden' : ''} h-30 relative inline-block text-center py-2 px-42 mr-2 border border-transparent shadow-sm rounded-md h-9 w-20 ${bg} ${hoverBg}`}>
      <PulseLoader
        color="white"
        loading={loading}
        size={10}
      />
    </div>
  );
}
