import Image from "next/image";
import Link from "next/link";
import logo from "@public/logo.svg"

export default function Logo() {
    return (
        <Link href="/" className="relative w-[120px] lg:w-[155px] aspect-[155/48]">
            <Image
                src={logo}
                alt="Fleeto Logo"
                fill
                className="object-contain"
            />
        </Link>
    );
}