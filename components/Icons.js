const CLASSES_ICON_SELECTED = 'text-gray-300 mr-4 h-6 w-6';
const CLASSES_ICON_NORMAL = 'text-gray-400 group-hover:text-gray-300 mr-4 h-6 w-6';

function IconArrowCircleDown({color, hoverColor, height=6, width=6, extraClasses}) {
  const colorClass = color ? color : '';
  const hoverColorClass = hoverColor ? `group-hover:${hoverColor}` : '';
  const className = `${colorClass} ${hoverColorClass} h-${height} w-${width} ${extraClasses}`;
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
    >
      <path 
        d="M15 13L12 16M12 16L9 13M12 16L12 8M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" 
        strokeWidth="2" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconArrowCircleUp({color, hoverColor, height=6, width=6, extraClasses}) {
  const colorClass = color ? color : '';
  const hoverColorClass = hoverColor ? `group-hover:${hoverColor}` : '';
  const className = `${colorClass} ${hoverColorClass} h-${height} w-${width} ${extraClasses}`;
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
    >
      <path 
        d="M9 11L12 8M12 8L15 11M12 8L12 16M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z" 
        strokeWidth="2" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBookOpen({isSelected}) {
  const className = isSelected ? CLASSES_ICON_SELECTED : CLASSES_ICON_NORMAL;
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
    >
      <path 
        d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" 
        strokeWidth="2" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCalendar({isSelected}) {
  const className = isSelected ? CLASSES_ICON_SELECTED : CLASSES_ICON_NORMAL;
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function IconChartBar({isSelected}) {
  const className = isSelected ? CLASSES_ICON_SELECTED : CLASSES_ICON_NORMAL;
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function IconCurrencyDollar({isSelected}) {
  const className = isSelected ? CLASSES_ICON_SELECTED : CLASSES_ICON_NORMAL;
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none" 
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
      >
      <path 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        d="M12 8C10.3431 8 9 8.89543 9 10C9 11.1046 10.3431 12 12 12C13.6569 12 15 12.8954 15 14C15 15.1046 13.6569 16 12 16M12 8C13.1104 8 14.0799 8.4022 14.5987 9M12 8V7M12 8L12 16M12 16L12 17M12 16C10.8896 16 9.92008 15.5978 9.40137 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
      />
    </svg>
  );
}

function IconExclamation(isSelected) {
  return (
    <svg
      className="h-6 w-6 text-red-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

function IconFolder(isSelected) {
  const className = isSelected ? CLASSES_ICON_SELECTED : CLASSES_ICON_NORMAL;
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  );
}

function IconHome({isSelected}) {
  const className = isSelected ? CLASSES_ICON_SELECTED : CLASSES_ICON_NORMAL;
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function IconInbox(isSelected) {
  const className = isSelected ? CLASSES_ICON_SELECTED : CLASSES_ICON_NORMAL;
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg
      className="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

function IconPencil({color, hoverColor, height=6, width=6, extraClasses}) {
  const colorClass = color ? color : '';
  const hoverColorClass = hoverColor ? `hover:${hoverColor} group-hover:${hoverColor}` : '';
  const className = `${colorClass} ${hoverColorClass} h-${height} w-${width} ${extraClasses ? extraClasses : ''}`;
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15.2322 5.23223L18.7677 8.76777M16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4644L16.7322 3.73223Z"
      />
    </svg>
  );
}

function IconTrash({color, hoverColor, height=6, width=6, extraClasses}) {
  const colorClass = color ? color : '';
  const hoverColorClass = hoverColor ? `group-hover:${hoverColor}` : '';
  const className = `${colorClass} ${hoverColorClass} h-${height} w-${width} ${extraClasses}`;
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
    >
      <path 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" 
      />
    </svg>
  );
}

function IconUser({isSelected}) {
  const className = isSelected ? CLASSES_ICON_SELECTED : CLASSES_ICON_NORMAL;
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
    >
      <path 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
      />
      <path 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" 
      />
    </svg>
  );
}

function IconUsers(isSelected) {
  const className = isSelected ? CLASSES_ICON_SELECTED : CLASSES_ICON_NORMAL;
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      className="h-6 w-6 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

const ICONS = {
  arrowCircleDown: IconArrowCircleDown,
  arrowCircleUp: IconArrowCircleUp,
  bookOpen: IconBookOpen,
  calendar: IconCalendar,
  chartBar: IconChartBar,
  currencyDollar: IconCurrencyDollar,
  exclamation: IconExclamation,
  folder: IconFolder,
  home: IconHome,
  inbox: IconInbox,
  menu: IconMenu,
  pencil: IconPencil,
  trash: IconTrash,
  user: IconUser,
  users: IconUsers,
  x: IconX
}

function getIcon(name) {
  return ICONS[name];
} 

export { IconArrowCircleDown, IconArrowCircleUp, IconBookOpen, IconCalendar, IconChartBar, IconCurrencyDollar, IconExclamation, IconFolder, IconHome, IconInbox, IconMenu, IconPencil, IconTrash, IconUsers, IconX };
export default getIcon;