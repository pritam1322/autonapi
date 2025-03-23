'use client'
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {signIn} from "next-auth/react";

export default function LoginButton(){
    return (
        <div className="bg-neutral-100 hover:bg-neutral-300 text-neutral-900 p-2 rounded-md w-full items-center border-b mb-4">
            <button
                onClick={() => signIn('google', { callbackUrl: "/" })}
                className="flex gap-2 mx-auto items-center">
                <FontAwesomeIcon icon={faGoogle} className="h-5"/>
                <span className="text-center text-sm">Continue with Google</span>
            </button>
        </div>
    )
}