"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left side - Copyright */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {currentYear} FFP CHAT</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-current" />{" "}
              for developers
            </span>
          </div>

          {/* Right side - Social Links */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Connect:</span>
            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
              <a
                href="https://github.com/BCAPATHSHALA/PersonaAI"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
              <a
                href="https://x.com/manojofficialmj"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
              <a
                href="https://www.linkedin.com/in/manojofficialmj/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
