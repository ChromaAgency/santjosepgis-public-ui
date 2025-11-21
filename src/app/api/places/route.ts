import { NextResponse } from 'next/server'

const EXTERNAL_API_BASE = 'https://santjosepgis.chroma.agency'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const search = url.search ? url.search : ''
  const target = `${EXTERNAL_API_BASE}/places/${search}`

  try {
    const res = await fetch(target, {
      // Forward minimal headers; Next fetch is server-side so CORS no aplica
      headers: {
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream error ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Proxy error' },
      { status: 500 }
    )
  }
}