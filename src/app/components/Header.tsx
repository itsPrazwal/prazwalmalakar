"use client";

import {NAVIGATIONS} from "@/constants/navigation";
import Link from "next/link";
import {PROFILE} from "@/assets/data/profile";
import {Logo} from "@/assets/icons/logo";
import {usePathname} from "next/navigation";
import {NavigationType} from "@/types/general";
import {CurrentDateTime} from "@/app/components/CurrentDateTime";

interface INavs {
  active: NavigationType
  inactive: NavigationType[]
}

export function Header() {

  const pathname = usePathname();

  const navs: INavs = NAVIGATIONS.reduce((acc: INavs, curr) => {
    if (curr.href === pathname) {
      acc.active = curr;
    } else {
      acc.inactive.push(curr);
    }
    return acc
  }, {active: {href: "", label: ""}, inactive: []} as INavs);


  return (
    <header className="w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 left-0">
      <div className="text-lg font-semibold text-gray-800 uppercase w-1/4 tracking-widest flex items-center gap-x-4">
        <Link href="/" className="flex items-center space-x-2">
          <Logo width={30} height={30} />
        </Link>
        <CurrentDateTime />
      </div>
      <div className="text-2xl font-semibold text-gray-800 uppercase w-2/4 tracking-widest text-center">
        {navs.active.label || PROFILE.name}
      </div>

      <nav className="flex justify-end space-x-8 w-1/4">
        {navs.inactive.map((item) => (
          <Link key={item.label} href={item.href}>
            <span className="text-gray-600 hover:text-gray-900 hover:scale-110 inline-block transition-all uppercase">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </header>
  )
}