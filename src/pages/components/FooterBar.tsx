import { Footer, Link } from "react-daisyui";

export default function FooterBar() {
  return (
    <Footer className="rounded-2xl bg-black">
      <Footer.Title className="items-center justify-center">
        <Link href="/">Home</Link>
      </Footer.Title>
    </Footer>
  );
}
