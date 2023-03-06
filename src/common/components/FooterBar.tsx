import { Footer } from "react-daisyui";
import Link from "next/link";

export default function FooterBar() {
  return (
    <Footer className="mt-4 flex flex-col items-center justify-center rounded-2xl bg-black p-10 text-center text-neutral-content">
      <div className="place-items-center">
        <Footer.Title>Company</Footer.Title>
        <Link className="link-hover link" href={"/about"}>
          About
        </Link>
        <Link className="link-hover link" href={"/contact"}>
          Contact
        </Link>
        <Link className="link-hover link" href={"/support"}>
          Support
        </Link>
        <a className="link-hover link">Github</a>
      </div>
    </Footer>
  );
}
