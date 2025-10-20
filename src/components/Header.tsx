import QCLogo from '@/img/QCLogo.png';
import N8Logo from '@/img/N8Logo.png';
import Image from 'next/image';


export default function Header() {
  const logo = process.env.NEXT_PUBLIC_THEME ? N8Logo : N8Logo;
  const inactiveClass = "text-muted hover:text-white transition-colors"
  const activeClass = "text-white border-b-2 border-primary pb-1 transition-colors hover:text-primary"
  return (
    <header className="bg-black shadow-lg">
      <div className="px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-48 h-12">
            <Image 
              src={logo} 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <nav>
            {/* <ul className="flex space-x-6">
              <MenuLink href="/dashboard" activeClass={activeClass} inactiveClass={inactiveClass}>Dashboard</MenuLink>
              <MenuLink href="/wells" activeClass={activeClass} inactiveClass={inactiveClass}>Lista de pozos</MenuLink>
              <MenuLink href="/" activeClass={activeClass} inactiveClass={inactiveClass}>Mapa</MenuLink>
              <MenuLink href="/communications" activeClass={activeClass} inactiveClass={inactiveClass}>Comunicaciones</MenuLink>
            </ul> */}
          </nav>
          {/* <LogoutButton /> */}
        </div>
      </div>
    </header>
  );
}