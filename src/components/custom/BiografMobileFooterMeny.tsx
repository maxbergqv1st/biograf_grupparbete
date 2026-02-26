// TODO : implemented additional funktionality and maybe move it to root layout scope

import { useState } from 'react';
import { Link } from 'react-router-dom';


export default function BiografMobileFooterMeny() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="flex items-center justify-around relative w-[342px] h-[82px] rounded-[20px] bg-[#000000]">

      <Link
        to="/products"
        className="flex items-center justify-center gap-2 w-[113px] h-[58px] rounded-[20px] bg-[#B69852] text-[#000000] font-semibold"
      >
        <img src="/images/icons/Filmicon.svg" alt="Film" className="h-6 w-6" />
        <span>Filmer</span>
      </Link>

      <Link
        to="/kalender"
        className="flex items-center justify-center w-[58px] h-[58px] rounded-[20px] bg-gradient-to-r from-[#000000] to-[#D9D9D9] text-[#F3EEE4]"
      >
        <img src="/images/icons/Calendaricon02.svg" alt="Kalender" className="h-7 w-7" />
      </Link>

      <Link
        to="/biljetter"
        className="flex items-center justify-center w-[58px] h-[58px] rounded-[20px] bg-gradient-to-r from-[#000000] to-[#D9D9D9] text-[#F3EEE4]"
      >
        <img src="/images/icons/Biljeticon.svg" alt="Biljetter" className="h-7 w-7" />
      </Link>

      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center justify-center w-[58px] h-[58px] rounded-[20px] bg-gradient-to-r from-[#000000] to-[#D9D9D9] text-[#F3EEE4]"
      >
        <img src="/images/icons/Tredotsicon.svg" alt="Mer" className="h-7 w-7" />
      </button>

      {showMenu && (
        <div className="absolute bottom-16 right-0 bg-[#141414] rounded-[12px] p-2 min-w-[120px]">
          <Link
            to="/about"
            className="flex items-center gap-2 p-2 text-[#F3EEE4] hover:text-[#B69852]"
            onClick={() => setShowMenu(false)}
          >
            <span>Om oss</span>
          </Link>
          <Link
            to="/our-vision"
            className="flex items-center gap-2 p-2 text-[#F3EEE4] hover:text-[#B69852]"
            onClick={() => setShowMenu(false)}
          >
            <span>Vision</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
