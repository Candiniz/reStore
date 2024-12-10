'use client'

import { UserNav } from "../common/user-nav"

export default function UserAppHeader() {

    return(
        <header>
            <nav className="flex justify-between text-white bg-[#052539] w-full py-2 px-5 fixed top-0 left-0 z-50">
                <span className="font-extrabold text-2xl">re<span className="font-extralight">Stora</span></span>
                <UserNav />
            </nav>
        </header>
    )

}