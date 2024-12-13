import { FaGithub } from "react-icons/fa"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function SiteHeader() {
  return (
    <div className="relative space-y-2 text-center mb-12 bg-gray-50 p-8 rounded-lg">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://github.com/askjohngeorge/sales-prompt-creator"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-8 top-8 text-black hover:scale-110 transition-all"
            >
              <FaGithub className="w-6 h-6" />
              <span className="sr-only">View source on GitHub</span>
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>View source on GitHub</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <h1 className="text-4xl font-bold tracking-tight">AI Sales Prompt Creator</h1>
      <p className="text-muted-foreground text-lg">
        Generate and test personalized AI sales representative prompts in seconds
      </p>
    </div>
  )
}
