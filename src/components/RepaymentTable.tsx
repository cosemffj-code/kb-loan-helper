import type { LoanCalculationResult } from '../lib/finance'
import { formatWon } from '../lib/finance'

interface RepaymentTableProps {
  result: LoanCalculationResult | null
}

export default function RepaymentTable({ result }: RepaymentTableProps) {
  if (!result || result.schedule.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 dark:border-slate-600 dark:bg-slate-800/50">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-md bg-slate-400 px-2 py-0.5 text-xs font-semibold text-white dark:bg-slate-600">
            스케줄
          </span>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">월별 상환 스케줄</h3>
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          대출 조건을 입력하고 <strong className="font-medium text-slate-600 dark:text-slate-300">계산하기</strong>를
          누르면 회차별 상환 내역이 표로 표시됩니다.
        </p>
      </div>
    )
  }

  const thClassName =
    'sticky top-0 border-b-2 border-slate-300 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'
  const tdClassName = 'px-4 py-2.5 text-sm tabular-nums text-slate-800 dark:text-slate-200'

  return (
    <div className="rounded-xl border-2 border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-slate-700 px-2 py-0.5 text-xs font-semibold text-white dark:bg-slate-600">
            스케줄
          </span>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">월별 상환 스케줄</h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">총 {result.schedule.length}회 · 단위: 원</span>
      </div>

      <div className="print-expand max-h-[420px] overflow-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className={`${thClassName} w-16 text-center`}>회차</th>
              <th className={`${thClassName} text-right`}>월 상환액</th>
              <th className={`${thClassName} text-right`}>납입 원금</th>
              <th className={`${thClassName} text-right`}>이자</th>
              <th className={`${thClassName} text-right`}>잔액</th>
            </tr>
          </thead>
          <tbody>
            {result.schedule.map((row, index) => (
              <tr
                key={row.seq}
                className={`border-b border-slate-100 transition-colors hover:bg-blue-50/70 dark:border-slate-700 dark:hover:bg-blue-950/30 ${
                  index % 2 === 0 ? 'bg-white dark:bg-gray-800/50' : 'bg-slate-50/80 dark:bg-gray-800/80'
                }`}
              >
                <td className={`${tdClassName} text-center font-medium text-slate-600 dark:text-slate-400`}>
                  {row.seq}
                </td>
                <td className={`${tdClassName} text-right font-semibold text-slate-900 dark:text-slate-100`}>
                  {formatWon(row.payment)}
                </td>
                <td className={`${tdClassName} text-right`}>{formatWon(row.principal)}</td>
                <td className={`${tdClassName} text-right text-slate-600 dark:text-slate-400`}>
                  {formatWon(row.interest)}
                </td>
                <td className={`${tdClassName} text-right font-medium`}>{formatWon(row.balance)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-700">
              <td className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">합계</td>
              <td className="px-4 py-3 text-right text-sm font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {formatWon(result.schedule.reduce((sum, row) => sum + row.payment, 0))}
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {formatWon(result.schedule.reduce((sum, row) => sum + row.principal, 0))}
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {formatWon(result.schedule.reduce((sum, row) => sum + row.interest, 0))}
              </td>
              <td className="px-4 py-3 text-right text-xs text-slate-500 dark:text-slate-400">—</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
