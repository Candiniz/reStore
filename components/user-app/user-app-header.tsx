'use client'

import { UserNav } from "../common/user-nav"

export default function UserAppHeader() {

    return(
        <header>
            <nav className="flex justify-between text-black m-4">
                <span className="font-extrabold text-2xl">re<span className="font-extralight">Store</span></span>
                <UserNav />
            </nav>
        </header>
    )

}