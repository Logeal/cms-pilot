import { NextResponse, type NextRequest } from "next/server";
import { decodeSessionToken } from "@/lib/auth";

// Workers may only reach the article list at /admin/articles. Any other
// /admin/* route — including the article edit page /admin/articles/[id] —
// redirects them back. The matcher excludes /admin/articles itself so we
// don't redirect-loop the only page they can use.
export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (!path.startsWith("/admin")) return NextResponse.next();

  const token = req.cookies.get("cms_session")?.value;
  const session = decodeSessionToken(token);

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (session.role === "worker") {
    // Allowed: exactly /admin/articles (the list). Block all other admin
    // paths, including the article edit page /admin/articles/<id>.
    const allowed = path === "/admin/articles";
    if (!allowed) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/articles";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
