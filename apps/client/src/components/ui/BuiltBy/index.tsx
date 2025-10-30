import { useState } from "react";
import styles from "./BuiltBy.module.css";

const BuiltBy = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <a
      href="https://github.com/toptal126"
      target="_blank"
      rel="noopener noreferrer"
      onContextMenu={handleRightClick}
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 text-sm text-white hover:text-white transition-all duration-200 hover:border-slate-500 hover:shadow-lg hover:shadow-slate-500/30 cursor-pointer group min-w-fit`}
    >
      <span>Built by</span>
      <div className="flex items-center gap-2 hover:text-blue-300 transition-colors duration-200">
        <img
          src="https://avatars.githubusercontent.com/u/86443571?v=4"
          alt="toptal126"
          className="w-6 h-6 rounded-full ring-2 ring-background flex-shrink-0"
        />
        <span
          className={`font-medium relative overflow-hidden min-w-[80px] text-center leading-tight h-5`}
        >
          <span className={`${styles.textTop}`}>toptal126</span>
          <span className={`${styles.textMid}`}>catching</span>
          <span className={`${styles.textBot}`}>snowflakes</span>
        </span>
      </div>
    </a>
  );
};
export default BuiltBy;
