export function EmailField({ role }) {
  const placeholder = role === 'admin' ? 'curator@obsidian.gallery' : 'artist@creative.studio';
  return (
    <div className="space-y-1">
      <label className="font-label-md text-label-md text-on-surface-variant uppercase" htmlFor="email">
        Institutional Email
      </label>
      <input 
        className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-primary py-3 px-0 font-body-md text-body-md focus:outline-none focus:border-secondary transition-all" 
        id="email" 
        name="email"
        placeholder={placeholder} 
        type="email" 
        required 
      />
    </div>
  );
}