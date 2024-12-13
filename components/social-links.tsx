import { FaTwitter, FaLinkedin, FaGithub, FaYoutube } from "react-icons/fa";

export default function SocialLinks({ className }: { className?: string }) {
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
