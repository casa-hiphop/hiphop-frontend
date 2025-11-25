/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: 'include',
  })

  if (!res.ok) {
    const error = new Error('Erro ao buscar dados')
      // Adiciona info extra do backend
      ; (error as any).info = await res.json()
      ; (error as any).status = res.status
    throw error
  }

  return res.json()
}