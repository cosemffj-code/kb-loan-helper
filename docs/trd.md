수식 가독성을 개선하고 LaTeX 등 특수 문법을 완전히 제거하여 어디서나 바로 복사·붙여넣기 및 가독이 편리하도록 재정리한 **기술 요구사항 정의서(TRD)** 전문입니다.

---

# 기술 요구사항 정의서 (Technical Requirement Document)

## 1. 시스템 아키텍처 및 기술 스택 (System Architecture & Tech Stack)

### 1.1. 개발 프레임워크 및 라이브러리
* **Language & Runtime**: TypeScript 5.x, Node.js (Vite 환경)
* **Frontend Library**: React 19 (또는 React 18 안정화 버전)
* **Build Tool**: Vite
* **Styling**: TailwindCSS (Utility-first CSS)
* **State Management**: React `useState` / `useReducer`
* **Data Storage**: Browser `localStorage` (필수), Supabase (고급 확장 시 클라우드 연동)
* **Testing**: Vitest (로직 단위 테스트 검증)
* **Deployment**: Vercel

---

## 2. 프로젝트 디렉토리 구조 (Project Directory Structure)

설계된 물리적 파일 배치 구조는 아래와 같으며, 대출 상환 연산 로직(lib/finance.ts)과 브라우저 저장소 유틸리티(lib/storage.ts)를 컴포넌트 계층과 분리하여 독립적인 테스트 및 유지보수가 용이하도록 구성합니다.

```text
KB_이름_여신도우미/
├── README.md                    # 프로젝트 전체 기능 및 개발 환경 명세 문서
├── .cursor/
│   └── rules/
│       └── project.mdc          # AI 어시스턴트(Cursor) 가이드라인 및 규칙 정의 파일
├── docs/
│   ├── PRD.md                   # 제품 요구사항 정의서 (AI 협업 작성본)
│   └── prompts.md               # 주요 시스템 프롬프트 및 히스토리 기록
├── index.html                   # 애플리케이션 엔트리 HTML 파일
├── package.json                 # 의존성 패키지 및 스크립트 정의
├── vite.config.ts               # Vite 빌드 환경 설정 파일
├── tailwind.config.js           # Tailwind CSS 테마 및 스타일 설정
└── src/
    ├── main.tsx                 # React App 구동 엔트리 포인트
    ├── App.tsx                  # 메인 대시보드 레이아웃 및 탭 상태 관리
    ├── index.css                # 글로벌 CSS 스타일 및 Tailwind 지시어
    ├── lib/
    │   ├── finance.ts           # 상환금 및 이자 계산 비즈니스 로직 (부수 효과가 없는 순수 함수)
    │   └── storage.ts           # localStorage 데이터 읽기/쓰기 유틸리티 함수
    └── components/
        ├── LoanCalculator.tsx   # 대출금액, 이자율, 대출기간 입력 및 연산 트리거 컴포넌트
        ├── RepaymentTable.tsx   # 회차별 납입 원금, 이자, 잔액을 표현하는 스케줄 테이블
        └── ConsultationMemo.tsx # 상담 메모 추가, 삭제 및 실시간 키워드 필터링 컴포넌트
```

---

## 3. 데이터 모델 및 스키마 설계 (Data Model & Schema)

### 3.1. 상담 메모 데이터 인터페이스 (src/lib/storage.ts 또는 타입 정의 파일)
* **데이터 객체 스키마**

| 필드명 | 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| id | string | Unique Key | 메모 고유 식별값 (UUID 또는 Date.now 기반 식별자) |
| title | string | Not Empty | 고객명 또는 상담 간략 주제 |
| content | string | - | 구체적인 상담 기술 메모 |
| createdAt | string | - | 메모 등록 일시 (ISO 8601 포맷) |

---

## 4. 핵심 비즈니스 로직 및 계산 공식 (src/lib/finance.ts)

### 4.1. 원리금균등상환 계산 로직

* **월 상환액 공식 (M)**:
  `M = P * r * (1 + r)^n / ((1 + r)^n - 1)`
  * P: 대출 원금
  * r: 월 이자율 (연이자율 / 12 / 100)
  * n: 대출 기간 (개월 수)
  *(단, 이자율 r이 0인 경우, M = P / n 으로 예외 처리 연산)*

* **월별 상환 스케줄 표 잔액 계산**:
  매월 루프를 돌며 아래 순서대로 값을 산출하여 스케줄 표를 생성합니다.
  1. **매월 이자** = 잔액 * r
  2. **원금** = M - 이자
  3. **잔액** = 잔액 - 원금

* **함수 인터페이스 시그니처**:
```typescript
// src/lib/finance.ts

export interface RepaymentRow {
  seq: number;       // 회차
  payment: number;   // 월 상환액 (원리금)
  principal: number; // 납입 원금
  interest: number;  // 이자
  balance: number;   // 남은 원금 잔액
}

export interface LoanCalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: RepaymentRow[];
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
  months: number
): LoanCalculationResult {
  const schedule: RepaymentRow[] = [];
  
  // 이자율이 0인 예외 상황 처리
  if (annualRate === 0) {
    const monthlyPayment = Math.round(principal / months);
    let remainingBalance = principal;
    
    for (let seq = 1; seq <= months; seq++) {
      const isLast = seq === months;
      const principalPaid = isLast ? remainingBalance : monthlyPayment;
      remainingBalance = isLast ? 0 : remainingBalance - principalPaid;
      
      schedule.push({
        seq,
        payment: principalPaid,
        principal: principalPaid,
        interest: 0,
        balance: remainingBalance,
      });
    }
    
    return {
      monthlyPayment,
      totalPayment: principal,
      totalInterest: 0,
      schedule,
    };
  }

  // r = 연이자율 / 12 / 100 (소수점 변환값)
  const r = annualRate / 12 / 100;
  const tempVal = Math.pow(1 + r, months);
  
  // 월 상환액 M 계산
  const M = Math.round(principal * r * tempVal / (tempVal - 1));
  
  let remainingBalance = principal;
  let totalInterest = 0;

  for (let seq = 1; seq <= months; seq++) {
    const isLast = seq === months;
    
    // 매월 이자 = 잔액 * r
    const interestPaid = Math.round(remainingBalance * r);
    
    // 원금 = M - 이자
    let principalPaid = M - interestPaid;
    
    if (isLast) {
      principalPaid = remainingBalance;
    }
    
    // 잔액 = 잔액 - 원금
    remainingBalance = isLast ? 0 : remainingBalance - principalPaid;
    totalInterest += interestPaid;

    schedule.push({
      seq,
      payment: principalPaid + interestPaid,
      principal: principalPaid,
      interest: interestPaid,
      balance: remainingBalance,
    });
  }

  const totalPayment = principal + totalInterest;

  return {
    monthlyPayment: schedule[0]?.payment || M,
    totalPayment,
    totalInterest,
    schedule,
  };
}
```

---

## 5. 컴포넌트 연동 및 상태 인터페이스

### 5.1. 컴포넌트 역할 관계 정의
* **App.tsx (대시보드)**: 전체 탭(대출 계산기 / 예적금 계산기)을 전환하고, 공통 테마 상태(다크모드)를 관리합니다.
* **LoanCalculator.tsx**: 사용자의 수치 입력을 바인딩하며, `calculateEqualPrincipalAndInterest` 함수를 통해 도출된 연산 결과를 상태값으로 저장합니다. 해당 결과는 읽기 전용으로 `RepaymentTable.tsx`에 전달됩니다.
* **RepaymentTable.tsx**: 전달받은 `schedule` 배열 데이터를 기반으로 천 단위 포맷팅(예: `1,000,000원`)을 적용하여 리스트를 그리드 형태로 출력합니다.
* **ConsultationMemo.tsx**: 로컬 상태에서 메모 리스트 및 검색 질의 문자열(Query)을 추적하며, 데이터 변경 발생 시 `storage.ts` 유틸리티를 호출하여 `localStorage` 상태를 실시간으로 업데이트합니다.

---

## 6. 테스트 및 품질 검증 전략 (Testing)

* **대상 파일**: src/lib/finance.ts에 정의된 모든 연산식
* **테스트 도구**: Vitest
* **검증 시나리오**:
  1. 원금 1,000만 원, 연이자율 6%, 12개월 조건 입력 시 연산된 회차별 스케줄의 마지막 회차 잔액이 정확히 0원으로 수렴하는지 여부 검증.
  2. 비정상적 입력값(이자율 0 또는 원금 0 등) 발생 시 예외 동작 방지 및 정합성 검증.