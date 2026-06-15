const MEMOS_STORAGE_KEY = 'memos'

export interface Memo {
  id: string
  title: string
  content: string
  createdAt: string
}

export function loadMemos(): Memo[] {
  try {
    const raw = localStorage.getItem(MEMOS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Memo[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveMemos(memos: Memo[]): void {
  localStorage.setItem(MEMOS_STORAGE_KEY, JSON.stringify(memos))
}

export function createMemo(title: string, content: string): Memo {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
  }
}
