import Link from 'next/link';
import { Shield, Sparkles, Heart } from 'lucide-react';

export default function DesktopFooter() {
  return (
    <footer className="hidden md:block bg-[#1f0521] text-stone-300 border-t border-purple-950/60 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-amber-400 p-[1.5px]">
                <div className="w-full h-full bg-[#1f0521] rounded-[7px] flex items-center justify-center">
                  <span className="font-extrabold text-xs text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-300">
                    MI
                  </span>
                </div>
              </div>
              <span className="font-bold text-xl text-pink-500">Mera<span className="text-amber-400">India</span> <span className="text-xs text-stone-400 font-normal">UK</span></span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Connecting and celebrating the vibrant UK South Asian diaspora. Discover live music, community melas, festivals, culinary treasures, and local businesses.
            </p>
            <div className="flex items-center space-x-3 text-xs text-pink-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>London • Birmingham • Leicester • Manchester</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/events?category=MUSIC" className="hover:text-pink-400 transition-colors">
                  Bollywood & Classical Concerts
                </Link>
              </li>
              <li>
                <Link href="/events?category=FESTIVAL" className="hover:text-pink-400 transition-colors">
                  Diwali & Eid Melas UK
                </Link>
              </li>
              <li>
                <Link href="/listings" className="hover:text-pink-400 transition-colors">
                  UK Indian Restaurant Directory
                </Link>
              </li>
              <li>
                <Link href="/radio" className="hover:text-pink-400 transition-colors">
                  24/7 South Asian Radio
                </Link>
              </li>
            </ul>
          </div>

          {/* Communities */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3 uppercase tracking-wider">Diaspora Hubs</h4>
            <ul className="space-y-2 text-xs">
              <li className="text-stone-400">Wembley & Harrow (London)</li>
              <li className="text-stone-400">Soho Road (Birmingham)</li>
              <li className="text-stone-400">Belgrave Road / Golden Mile (Leicester)</li>
              <li className="text-stone-400">Curry Mile (Manchester)</li>
              <li className="text-stone-400">Southall & Ilford (London)</li>
            </ul>
          </div>

          {/* Admin & Management */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3 uppercase tracking-wider">Management</h4>
            <p className="text-xs text-stone-400 mb-3">
              Event organizers and administrators can log in to publish dates, ticket variants, and manage promotions.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-purple-900/60 border border-purple-700/60 hover:border-pink-500 text-xs font-medium text-pink-300 hover:text-white transition-all"
            >
              <Shield className="w-4 h-4 text-pink-400" />
              <span>Admin Portal Dashboard</span>
            </Link>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-purple-950/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400">
          <p>© {new Date().getFullYear()} MeraIndia UK. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Crafted for the UK South Asian diaspora with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
