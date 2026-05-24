"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalShell = ModalShell;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
function ModalShell(_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, _b = _a.maxWidth, maxWidth = _b === void 0 ? 'max-w-lg' : _b, children = _a.children, _c = _a.className, className = _c === void 0 ? '' : _c;
    return (<framer_motion_1.AnimatePresence>
      {isOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <framer_motion_1.m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#1b1b18]/80 backdrop-blur-sm"/>
          <framer_motion_1.m.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className={"relative w-full ".concat(maxWidth, " overflow-y-auto rounded-4xl bg-white p-8 shadow-2xl dark:bg-[#121212] ").concat(className)}>
            {children}
          </framer_motion_1.m.div>
        </div>)}
    </framer_motion_1.AnimatePresence>);
}
