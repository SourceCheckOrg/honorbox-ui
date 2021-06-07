import { Transition } from '@headlessui/react';

export default function NotificationPanel({show, bgColor, message}) {
  return (
    <Transition
      show={show}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="max-w-7xl mx-auto mb-4 px-4 sm:px-6 md:px-8 ">
        <div className={`${bgColor} shadow sm:rounded-md sm:overflow-hidden py-2 text-center`}>
          <span className="text-md font-medium text-gray-800">
            {message}
          </span>
        </div>
      </div>
    </Transition>
  );
}
