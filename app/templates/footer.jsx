const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
          <p className="text-sm">Built with 💙 using Next.js & Tailwind CSS</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;