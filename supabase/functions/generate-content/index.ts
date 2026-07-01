import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const {
      업종, 상품명, 할인율, 정상가, 할인가, 할인유형,
      이벤트문구, 종료시간, 유효시간, 매장명, 위치,
      운영시간, 쿠폰링크, 기타요구사항
    } = await req.json()

    if (!매장명 || !상품명) {
      return new Response(
        JSON.stringify({ error: '매장명, 상품명 필수' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      )
    }

    const prompt = `당신은 동네할인 SNS 마케팅 전문가입니다.
점주가 입력한 정보를 바탕으로 인스타그램 게시물 캡션과 해시태그를 생성해주세요.

[점주 입력 정보]
- 업종: ${업종 || '미입력'}
- 매장명: ${매장명}
- 상품명: ${상품명}
- 할인율: ${할인율 || ''}%
- 정상가: ${정상가 ? 정상가 + '원' : ''}
- 할인가: ${할인가 ? 할인가 + '원' : ''}
- 할인 유형: ${할인유형 || '타임세일'}
- 이벤트 문구: ${이벤트문구 || ''}
- 종료 시간: ${종료시간 || ''}
- 유효 시간: ${유효시간 || ''}
- 위치: ${위치 || ''}
- 운영 시간: ${운영시간 || ''}
- 쿠폰 링크: ${쿠폰링크 || ''}
- 기타 요구사항: ${기타요구사항 || ''}

[캡션 작성 규칙]
1. 첫 줄: 강렬한 이벤트 제목 (이모지 포함, 할인율/종료시간 강조)
2. 둘째 줄: 빈 줄
3. 본문: 할인 내용 + 혜택 설명 (이모지 체크리스트 형식, 3~4줄)
4. 빈 줄
5. CTA 문구: "지금 예약하고 할인받기" + 쿠폰링크 (링크 있을 경우)
6. 빈 줄
7. 위치/운영시간 정보

[해시태그 규칙]
- 10~15개 생성
- 지역명 + 업종 + 상품명 + 이벤트 키워드 조합
- 동네할인 필수 포함
- 한국어 해시태그

아래 JSON 형식으로만 응답하세요. 마크다운 코드블록(```) 없이 순수 JSON만:
{"caption": "캡션 전체 텍스트 (줄바꿈은 \\n 사용)", "hashtags": "#태그1 #태그2 #태그3"}`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await res.json()

    if (!data.content?.[0]?.text) {
      return new Response(
        JSON.stringify({ error: 'AI 생성 실패', detail: data }),
        { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
      )
    }

    let parsed
    try {
      const raw = data.content[0].text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      parsed = JSON.parse(raw)
    } catch {
      parsed = { caption: data.content[0].text, hashtags: '#동네할인' }
    }

    return new Response(
      JSON.stringify({ success: true, ...parsed }),
      { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }
})
