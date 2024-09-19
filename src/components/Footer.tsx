// File: Footer.tsx

import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolom 1: Tentang */}
          <div>
            <h3 className="text-2xl font-bold mb-4">FLASH SMAN Modal Bangsa</h3>
            <p className="text-gray-400 mb-4">
              Menyalakan semangat kreativitas dan inovasi melalui acara yang menginspirasi generasi muda.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-pink-400 transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-blue-300 transition-colors duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Kolom 2: Tautan Cepat */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">Beranda</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">Acara</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">Galeri</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">Kontak</a></li>
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Hubungi Kami</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                <a href="mailto:info@flashsmanmodalbangsa.com" className="hover:text-gray-300 transition-colors duration-300">
                  info@flashsmanmodalbangsa.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2" />
                <a href="tel:+6285123456789" className="hover:text-gray-300 transition-colors duration-300">
                  +62 851-2345-6789
                </a>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1" />
                <span>Jl. Bandara Sultan Iskandar Muda, Blang Bintang, Aceh Besar, Aceh 23372</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Garis Pemisah */}
        <hr className="border-gray-700 my-8" />

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} FLASH - SMAN Modal Bangsa. Created with 🚀 Alfaruq Asri, S.Pd . All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-gray-300 transition-colors duration-300 mr-4">Kebijakan Privasi</a>
            <a href="#" className="hover:text-gray-300 transition-colors duration-300">Syarat dan Ketentuan</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;