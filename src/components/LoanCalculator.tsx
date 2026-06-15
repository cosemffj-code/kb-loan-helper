import { useState } from 'react'
import {
  calculateEqualPrincipalAndInterest,
  formatWon,
  type LoanCalculationResult,
} from '../lib/finance'
import RepaymentTable from './RepaymentTable'

export default function LoanCalculator() {
  const [principalInput, setPrincipalInput] = useState('10000000')
  const [annualRateInput, setAnnualRateInput] = useState('6')
  const [monthsInput, setMonthsInput] = useState('12')
  const [result, setResult] = useState<LoanCalculationResult | null>(null)
  const [error, setError] = useState('')

  function handleCalculate() {
    const principal = Number(principalInput.replace(/,/g, ''))
    const annualRate = Number(annualRateInput)
    const months = Number(monthsInput)

    if (!Number.isFinite(principal) || principal <= 0) {
      setError('대출금액은 0보다 큰 숫자여야 합니다.')
      setResult(null)
      return
    }
    if (!Number.isFinite(annualRate) || annualRate < 0) {
      setError('연이자율은 0 이상이어야 합니다.')
      setResult(null)
      return
    }
    if (!Number.isFinite(months) || months <= 0 || !Number.isInteger(months)) {
      setError('대출기간은 1 이상의 정수(개월)여야 합니다.')
      setResult(null)
      return
    }

    setError('')
    setResult(calculateEqualPrincipalAndInterest(principal, annualRate, months))
  }

  function handlePrincipalChange(value: string) {
    const digits = value.replace(/[^\d]/g, '')
    setPrincipalInput(digits)
  }

  const inputClassName =
    'w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:ring-blue-900'

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">대출 상환 계산기</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          원리금균등상환 방식으로 월 상환액과 스케줄을 계산합니다.
        </p>
      </div>

      <div className="rounded-xl border-2 border-blue-100 bg-blue-50/60 p-5 dark:border-blue-900 dark:bg-blue-950/40">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-md bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">입력</span>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">대출 조건</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">대출금액</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder="예: 10,000,000"
                value={Number(principalInput || 0).toLocaleString('ko-KR')}
                onChange={(e) => handlePrincipalChange(e.target.value)}
                className={inputClassName}
              />
              <span className="shrink-0 rounded-md bg-slate-200 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-600 dark:text-slate-200">
                원
              </span>
            </div>
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">연이자율</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={0.1}
                placeholder="예: 5.0"
                value={annualRateInput}
                onChange={(e) => setAnnualRateInput(e.target.value)}
                className={inputClassName}
              />
              <span className="shrink-0 rounded-md bg-slate-200 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-600 dark:text-slate-200">
                %
              </span>
            </div>
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">대출기간</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                step={1}
                placeholder="예: 12"
                value={monthsInput}
                onChange={(e) => setMonthsInput(e.target.value)}
                className={inputClassName}
              />
              <span className="shrink-0 rounded-md bg-slate-200 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-600 dark:text-slate-200">
                개월
              </span>
            </div>
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
        <div
          role="note"
          className="mb-4 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
        >
          <span className="mt-0.5 shrink-0 font-bold text-amber-600 dark:text-amber-400" aria-hidden="true">
            ⓘ
          </span>
          <p>
            조건을 입력한 뒤 <strong className="font-semibold">계산하기</strong>를 누르면 월 상환액과
            하단 상환 스케줄이 표시됩니다. 금액은 천 단위 콤마로 표시됩니다.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200"
          >
            <span className="mt-0.5 shrink-0 font-bold text-red-500 dark:text-red-400" aria-hidden="true">
              !
            </span>
            <p>{error}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleCalculate}
          className="no-print w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 sm:w-auto"
        >
          계산하기
        </button>
      </div>

      {result && (
        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/40">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">결과</span>
            <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">계산 요약</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-200 bg-white px-4 py-3 dark:border-emerald-800 dark:bg-gray-800">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">월 상환액</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-emerald-900 dark:text-emerald-100">
                {formatWon(result.monthlyPayment)}
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-white px-4 py-3 dark:border-emerald-800 dark:bg-gray-800">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">총 상환액</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-emerald-900 dark:text-emerald-100">
                {formatWon(result.totalPayment)}
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-white px-4 py-3 dark:border-emerald-800 dark:bg-gray-800">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">총 이자 (참고)</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-emerald-900 dark:text-emerald-100">
                {formatWon(result.totalInterest)}
              </p>
            </div>
          </div>
        </div>
      )}

      <RepaymentTable result={result} />
    </section>
  )
}
