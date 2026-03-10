import { Github, Linkedin } from "lucide-react";

export function CreatorBanner() {
  return (
    <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

      <div className="relative max-w-6xl mx-auto px-4 py-5 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-zinc-300 tracking-wide">
              Created by{" "}
              <span className="text-amber-400 font-semibold">
                Dex-Xavier Copeland
              </span>
            </p>
            <p className="text-xs text-zinc-500 mt-1 max-w-md">
              Questions or suggestions? Connect with me below.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/dexcopeland/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium text-zinc-300 bg-white/5 border border-white/10 hover:bg-[#0077b5]/20 hover:border-[#0077b5]/40 hover:text-[#0077b5] transition-all duration-200"
            >
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn
            </a>
            <a
              href="https://github.com/dexcopeland"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
