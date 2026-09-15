export default function Footer() {
  return (
    <footer className="py-8 px-6 md:px-12 bg-[#020202] border-t border-white/5 flex flex-col md:flex-row items-center justify-between font-sans text-xs text-white/40">
      <div>© {new Date().getFullYear()} Evil Creatives. All rights reserved.</div>
      <div className="mt-4 md:mt-0 uppercase tracking-widest">Creative AI Studio</div>
    </footer>
  );
}
