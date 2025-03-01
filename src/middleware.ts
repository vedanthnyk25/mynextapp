import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
export {default} from 'next-auth/middleware'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = new URL(request.nextUrl)

    if(token&&
        url.pathname.startsWith('/sign-in')||
        url.pathname.startsWith('/sign-up')||
        url.pathname.startsWith('/verify')||
        url.pathname.startsWith('/')
    ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  return NextResponse.redirect(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher:[ '/dashboard/:path*',
            '/sign-in',
            '/sign-up',
            '/verify/:path*',
            '/'
        ]
}