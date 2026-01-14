import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-hookah-dark">
      {/* Основной контент */}
      <main className="pb-20">
        {children}
      </main>
      
      {/* Навигация */}
      <Navbar />
    </div>
  );
};

export default Layout;
