const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const FREE_MODELS = [
  'nvidia/nemotron-3.5-super-vl:free',
  'nvidia/nemotron-3.5-lightning:free',
  'liquid/lfm-2.5-2.6b:free',
]

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'AI not configured' })
  }

  const { systemPrompt, messages } = req.body
  if (!systemPrompt || !messages) {
    return res.status(400).json({ error: 'systemPrompt and messages required' })
  }

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
          'HTTP-Referer': req.headers.origin || 'https://pocket-money-manager.vercel.app',
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
      if (text) return res.status(200).json({ text })
    }
  }

  return res.status(500).json({ error: 'AI service unavailable. Please try again.' })
}
