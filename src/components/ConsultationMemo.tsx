import { useEffect, useMemo, useState } from 'react'
import { createMemo, loadMemos, saveMemos, type Memo } from '../lib/storage'

export default function ConsultationMemo() {
  const [memos, setMemos] = useState<Memo[]>(() => loadMemos())
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    saveMemos(memos)
  }, [memos])

  const filteredMemos = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return memos
    return memos.filter(
      (memo) =>
        memo.title.toLowerCase().includes(keyword) ||
        memo.content.toLowerCase().includes(keyword),
    )
  }, [memos, query])

  function handleAdd() {
    if (!title.trim() || !content.trim()) return
    setMemos((prev) => [createMemo(title, content), ...prev])
    setTitle('')
    setContent('')
  }

  function handleDelete(id: string) {
    setMemos((prev) => prev.filter((memo) => memo.id !== id))
  }

  const fieldClassName =
    'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'

  return (
    <section className="flex h-full flex-col space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">상담 메모</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          상담 내용을 기록합니다. 주민등록번호·계좌번호 등 민감 정보는 저장하지 마세요.
        </p>
      </div>

      <div className="no-print space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/50">
        <input
          type="text"
          placeholder="제목 (고객명 또는 상담 주제)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={fieldClassName}
        />
        <textarea
          placeholder="상담 내용"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={fieldClassName}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!title.trim() || !content.trim()}
          className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          메모 추가
        </button>
      </div>

      <input
        type="search"
        placeholder="제목·내용 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`no-print ${fieldClassName}`}
      />

      <ul className="print-expand flex-1 space-y-3 overflow-y-auto">
        {filteredMemos.length === 0 ? (
          <li className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
            {query ? '검색 결과가 없습니다.' : '등록된 메모가 없습니다.'}
          </li>
        ) : (
          filteredMemos.map((memo) => (
            <li
              key={memo.id}
              className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-700/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{memo.title}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300">
                    {memo.content}
                  </p>
                  <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    {new Date(memo.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(memo.id)}
                  className="no-print shrink-0 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  삭제
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  )
}
