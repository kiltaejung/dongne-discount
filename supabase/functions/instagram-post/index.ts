import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ACCOUNT_ID = Deno.env.get('INSTAGRAM_ACCOUNT_ID')!
const ACCESS_TOKEN = Deno.env.get('INSTAGRAM_ACCESS_TOKEN')!

serve(async (req) => {
  try {
    const { image_url, caption } = await req.json()

    if (!image_url || !caption) {
      return new Response(JSON.stringify({ error: 'image_url, caption 필수' }), { status: 400 })
    }

    // 1단계: 미디어 컨테이너 생성
    const createRes = await fetch(
      `https://graph.instagram.com/v21.0/${ACCOUNT_ID}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url,
          caption,
          access_token: ACCESS_TOKEN,
        }),
      }
    )
    const createData = await createRes.json()

    if (!createData.id) {
      return new Response(JSON.stringify({ error: '미디어 생성 실패', detail: createData }), { status: 500 })
    }

    // 2단계: 컨테이너 상태 확인 (최대 10초 대기)
    let status = ''
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 2000))
      const statusRes = await fetch(
        `https://graph.instagram.com/v21.0/${createData.id}?fields=status_code&access_token=${ACCESS_TOKEN}`
      )
      const statusData = await statusRes.json()
      status = statusData.status_code
      if (status === 'FINISHED') break
    }

    if (status !== 'FINISHED') {
      return new Response(JSON.stringify({ error: '미디어 처리 타임아웃', status }), { status: 500 })
    }

    // 3단계: 게시물 발행
    const publishRes = await fetch(
      `https://graph.instagram.com/v21.0/${ACCOUNT_ID}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: createData.id,
          access_token: ACCESS_TOKEN,
        }),
      }
    )
    const publishData = await publishRes.json()

    if (!publishData.id) {
      return new Response(JSON.stringify({ error: '게시 실패', detail: publishData }), { status: 500 })
    }

    return new Response(
      JSON.stringify({ success: true, post_id: publishData.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
})
