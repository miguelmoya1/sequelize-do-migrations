export const getParentPath = () => {
  const _prepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = new Error().stack!.slice(1);
  Error.prepareStackTrace = _prepareStackTrace;
  return (stack[1] as any).getFileName() as string;
};
