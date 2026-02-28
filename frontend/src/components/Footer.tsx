const Footer = () => {
  return (
    <footer className="bg-black text-white p-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">&copy; 2026 Chat App. All rights reserved.</div>
        <div className="flex items-center space-x-4">
          <a href="https://aakanshapande.vercel.app/" target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:underline">Contact</a>
          <a href="https://github.com/aakanshaa0" target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:underline">GitHub</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;