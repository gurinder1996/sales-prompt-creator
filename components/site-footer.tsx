import { FaTwitter, FaLinkedin, FaGithub, FaYoutube } from "react-icons/fa";

function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={`flex ${className}`}>
      {[
        { icon: FaYoutube, href: "https://youtube.com/@askjohngeorge" },
        { icon: FaLinkedin, href: "https://linkedin.com/in/askjohngeorge"},
        { icon: FaGithub, href: "https://github.com/askjohngeorge" },
        { icon: FaTwitter, href: "https://x.com/askjohngeorge" },
      ].map((social, index) => (
        <span key={index}>
          <a href={social.href} target="_blank" rel="noopener noreferrer">
            <social.icon
              size={24}
              className="text-white transition-all duration-200 mx-2 ease-in-out hover:text-background hover:scale-125"
            />
          </a>
        </span>
      ))}
    </div>
  );
}


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
