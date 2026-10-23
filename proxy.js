import { NextResponse } from "next/server";

// Transmet le chemin de la page au layout (en-tête x-pathname).
// Sans cela, le layout ne sait pas qu'on est dans /admin : l'en-tête public s'afficherait dans l'administration
// et le mode maintenance bloquerait aussi l'accès à l'administration.
export function proxy(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:png|jpg|jpeg|svg|webp|pdf|ico|txt|xml)$).*)"],
};
