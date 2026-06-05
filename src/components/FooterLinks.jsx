export default function FooterLinks() {
  return (
    <footer className="mt-12 pt-gutter border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        New to the platform? 
                        <a className="text-primary font-bold hover:underline" href="#">Join as Artist</a>
      </p>
      <div className="flex gap-4">
        <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors uppercase" href="#">Support</a>
        <span className="text-outline-variant">•</span>
        <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors uppercase" href="#">Terms</a>
      </div>
    </footer>
  );
}
