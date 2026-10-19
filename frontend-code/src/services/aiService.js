const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const FREE_MODELS = [
  'nvidia/nemotron-3.5-super-vl:free',
  'nvidia/nemotron-3.5-lightning:free',
  'liquid/lfm-2.5-2.6b:free',
]

export async function callAI(systemPrompt, messages) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  if (!apiKey) throw new Error('AI not configured')

  const payload = {
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
  }

  for (const model of FREE_MODELS) {
    let response
    let delay = 1000
    for (let i = 0; i < 2; i++) {
      response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Pocket Money Manager',
        },
        body: JSON.stringify({ ...payload, model }),
      })
      if (response.ok) break
      if (response.status === 429 || response.status >= 500) {
        await new Promise((r) => setTimeout(r, delay))
        delay *= 2
      } else break
    }
    if (response.ok) {
      const result = await response.json()
      const text = result.choices?.[0]?.message?.content
      if (text) return text
    }
  }
  throw new Error('AI service unavailable. Please try again.')
}
