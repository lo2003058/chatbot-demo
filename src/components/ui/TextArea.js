import clsx from 'clsx';

export default function TextArea({className = '', ...props}) {
  return (
    <textarea
      className={clsx(
        'block w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500',
        className
      )}
      {...props}
    />
  );
}
