import { useNavigate } from "react-router-dom";

export default function CtaActions({ role }) {
  const navigate = useNavigate();
  const secondaryLabel = role === 'admin' ? 'Publish Exhibition' : 'Request Portfolio Review';
  return (
    <div className="pt-4 space-y-gutter">
      <button 
        type="submit" 
        className="w-full h-[56px] bg-primary text-white font-label-md text-label-md uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <span>Log In</span>
        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
      <button 
        type="button" 
        onClick={() => navigate("/")}
        className="w-full h-[56px] border border-secondary text-secondary font-label-md text-label-md uppercase tracking-widest hover:bg-secondary/5 transition-all flex items-center justify-center gap-2"
      >
        <span>{secondaryLabel}</span>
      </button>
    </div>
  );
}