"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParentPath = void 0;
const getParentPath = () => {
    const _prepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const stack = new Error().stack.slice(1);
    Error.prepareStackTrace = _prepareStackTrace;
    return stack[1].getFileName();
};
exports.getParentPath = getParentPath;
