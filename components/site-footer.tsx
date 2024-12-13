import SocialLinks from "./social-links";

export function SiteFooter() {
  return (
    <footer className="border-t bg-gray-900 py-6 mt-4">
      <div className="container mx-auto px-4 flex flex-col items-center gap-4 text-white">
        <p className="text-sm">
          <a
            href="https://askjohngeorge.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Built by John George (@askjohngeorge)
          </a>
        </p>
        <SocialLinks />
      </div>
    </footer>
  );
}
