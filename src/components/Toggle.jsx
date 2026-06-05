export default function Toggle({ role, setRole }) {
  return (
    <div className="flex mb-8 border-b border-outline-variant">
      <button className={`flex-1 pb-4 font-label-md text-label-md uppercase transition-all border-b-2 ${role === 'admin' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'}`} onClick={() => setRole('admin')}>Admin</button>
      <button className={`flex-1 pb-4 font-label-md text-label-md uppercase transition-all border-b-2 ${role === 'artist' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'}`} onClick={() => setRole('artist')}>Artist</button>
    </div>
  );
};