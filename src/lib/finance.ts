export interface RepaymentRow {
  seq: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface LoanCalculationResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  schedule: RepaymentRow[]
}

/** 금액을 천 단위 콤마 + 원 단위 문자열로 변환 */
export function formatWon(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

/**
 * 원리금균등상환 결과를 연산하는 순수 함수
 * @param principal 대출 원금 (원 단위)
 * @param annualRate 연이자율 (퍼센트 단위, 예: 5.5)
 * @param months 대출 기간 (개월 단위)
 */
export function calculateEqualPrincipalAndInterest(
  principal: number,
  annualRate: number,
  months: number,
): LoanCalculationResult {
  const schedule: RepaymentRow[] = []

  if (principal <= 0 || months <= 0) {
    return {
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      schedule: [],
    }
  }

  if (annualRate === 0) {
    const monthlyPayment = Math.round(principal / months)
    let remainingBalance = principal

    for (let seq = 1; seq <= months; seq++) {
      const isLast = seq === months
      const principalPaid = isLast ? remainingBalance : monthlyPayment
      remainingBalance = isLast ? 0 : remainingBalance - principalPaid

      schedule.push({
        seq,
        payment: principalPaid,
        principal: principalPaid,
        interest: 0,
        balance: remainingBalance,
      })
    }

    return {
      monthlyPayment,
      totalPayment: monthlyPayment * months,
      totalInterest: 0,
      schedule,
    }
  }

  const r = annualRate / 12 / 100
  const tempVal = Math.pow(1 + r, months)
  const M = Math.round((principal * r * tempVal) / (tempVal - 1))

  let remainingBalance = principal

  for (let seq = 1; seq <= months; seq++) {
    const isLast = seq === months
    const interestPaid = Math.round(remainingBalance * r)
    let principalPaid = M - interestPaid

    if (isLast) {
      principalPaid = remainingBalance
    }

    remainingBalance = isLast ? 0 : remainingBalance - principalPaid

    schedule.push({
      seq,
      payment: principalPaid + interestPaid,
      principal: principalPaid,
      interest: interestPaid,
      balance: remainingBalance,
    })
  }

  // 요약값: 월 상환액(M) × 기간 − 원금 = 총 이자(참고)
  const totalPayment = M * months
  const totalInterest = totalPayment - principal

  return {
    monthlyPayment: M,
    totalPayment,
    totalInterest,
    schedule,
  }
}
