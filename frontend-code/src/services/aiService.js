export async function callAI(systemPrompt, messages) {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, messages }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || 'AI service unavailable. Please try again.')
  }

  const data = await response.json()
  if (!data.text) throw new Error('Empty response from AI')
  return data.text
}
