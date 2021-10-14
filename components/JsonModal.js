import dynamic from 'next/dynamic'
const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });

export default function JsonModal({show, title, json, onCancel, children}) {
  return (
    <div className={`${!show ? 'hidden' : ''} fixed z-10 inset-0 overflow-y-auto`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <span className="hidden sm:inline-block sm:align-middle" aria-hidden="true">&#8203;</span>
          <div className="inline-block mt-60 h-96 w-3/4 bg-white text-left overflow-hidden shadow-xl transform transition-all my-auto sm:align-middle">
            <div className="bg-white">
              <div className="mt-3 sm:mt-0 sm:text-left sm:flex flex-col">
                <div className="bg-gray-200 flex-none p-2">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">{title}</h3>
                </div>
                { children }
                <div className="h-60 p-6 overflow-y-auto">
                  <DynamicReactJson 
                    src={json} 
                    quotesOnKeys={false}
                    displayArrayKey={false}
                    displayObjectSize={false}
                    displayDataTypes={false}
                  />
                 </div>
                <div className="flex-none justify-self-end bg-gray-50 py-1 sm:px-6 text-right">
                  <button onClick={onCancel} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
