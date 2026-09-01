import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const GoBackLink = ({ href, text }: { href: string, text: string }): React.ReactNode => {
  return (
    <Link href={href} className="group text-primary font-semibold text-sm">
      <ArrowLeft className="group-hover:-translate-x-1 transition-transform ease-in-out duration-300 inline mr-1 w-4 h-4" />
      <span>{text}</span>
    </Link>
  )
}