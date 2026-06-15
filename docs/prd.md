제공해주신 요구사항 명세서를 바탕으로, 은행 현업 직원의 업무 효율화를 위한 웹 도구 개발 프로젝트의 **PRD(제품 요구사항 정의서)**와 **TRD(기술 요구사항 정의서)**를 작성하였습니다.

---

# [PRD] 제품 요구사항 정의서 (Product Requirement Document)

## 1. 제품 개요 및 배경 (Product Overview & Background)
* **목적**: 은행 창구 및 상담 현업 직원이 매일 반복적으로 수행하는 대출 상환액 계산, 예적금 만기 수령액 산출, 고객 상담 메모 기록 및 관리 업무를 하나의 웹 대시보드에서 신속하게 처리하여 업무 효율성을 높이고 휴먼 에러를 방지합니다.
* **타겟 사용자**: 은행 지점 및 고객센터 근무 직원
* **핵심 가치**: 복잡한 금융 계산과 상담 이력 기록을 단일 화면(대시보드) 안에서 신속하게 전환하며 처리할 수 있는 직관적인 업무 도구 제공

---

## 2. 사용자 페르소나 및 유스케이스 (User Persona & Use Cases)
* **페르소나: 김대리 (32세, 은행 대출계 창구 직원)**
  * **상황**: 하루 평균 15명 이상의 고객을 맞이하며 대출 한도 및 상환액을 수기로 계산하거나 여러 개별 시스템을 번갈아 사용하느라 상담 흐름이 끊김. 상담 후 중요 내용을 메모지에 적어두다 유실하는 경우가 잦음.
  * **유스케이스**:
    1. 대출 상담을 진행하며 대시보드의 **대출 상환 계산기**에 금액과 이율을 입력해 월 상환액과 상세 스케줄을 고객에게 즉시 안내함.
    2. 계산된 결과를 **인쇄**하여 고객에게 영수증 형태로 제공함.
    3. 상담 도중 발생하는 특이사항이나 고객의 추가 요구사항을 **상담 메모 관리** 컴포넌트에 즉시 등록하고, 검색 기능으로 이전 상담 기록을 빠르게 조회함.

---

## 3. 기능 요구사항 (Functional Requirements)

### 3.1. MVP (핵심 기능)
| 기능 ID | 대분류 | 상세 기능 요구사항 | 비고 |
| :--- | :--- | :--- | :--- |
| **F-101** | **대출 상환 계산기** | - 입력값: 대출금액, 연이자율(%), 대출기간(개월)<br>- 원리금균등상환 방식 기준으로 **월 상환액, 총 상환액, 총 이자** 자동 계산<br>- **월별 상환 스케줄 표** 출력 (회차, 납입원금, 이자, 잔액 항목 포함)<br>- 모든 금액은 천 단위 구분 콤마(`,`) 및 원(원) 단위 표기 | 필수 |
| **F-102** | **상담 메모 관리** | - 상담 메모 추가 기능 (제목, 내용, 작성일시 포함)<br>- 등록된 상담 메모 삭제 기능<br>- 작성된 메모 제목 및 내용 기준의 실시간 키워드 검색(필터링)<br>- 브라우저 `localStorage`를 연동하여 새로고침 시에도 기존 데이터 유지 | 필수 |
| **F-103** | **사용자 인터페이스**| - 한 화면에서 대출 상환 계산기와 상담 메모 기능을 동시에 사용할 수 있는 통합 대시보드 형태의 UI 구성 | 필수 |

### 3.2. Advanced (고급 기능)
| 기능 ID | 대분류 | 상세 기능 요구사항 | 비고 |
| :--- | :--- | :--- | :--- |
| **F-201** | **금융 계산 확장** | - 예금 및 적금 만기 수령액 계산기 탭 추가 (단리 및 복리 옵션 선택 가능) | 선택 (고급) |
| **F-202** | **데이터 내보내기** | - 계산된 월별 상환 스케줄 표를 **CSV 파일**로 다운로드하거나, 화면을 바로 **인쇄(Print)**할 수 있는 기능 제공 | 선택 (고급) |
| **F-203** | **UI/UX 편의성** | - 시스템 기본 설정 혹은 토글 버튼을 통한 **다크모드** 기능<br>- 모바일 환경에서도 조작이 용이하도록 그리드 및 레이아웃을 최적화한 **반응형 웹 디자인** 적용 | 선택 (고급) |
| **F-204** | **데이터 영속성 확장**| - 로컬 저장을 넘어 **Supabase(PostgreSQL)**와 연동하여 상담 메모를 클라우드에 영구 저장 및 동기화 | 선택 (고급) |

---

## 4. 비기능적 요구사항 (Non-Functional Requirements)
* **성능**: 계산 로직 수행 및 결과 렌더링은 클라이언트 측에서 즉시(100ms 이내) 완료되어야 합니다.
* **사용성(UX)**: 금액 입력 필드에는 포커스가 해제되거나 입력될 때 실시간으로 한글 금액 표기(예: 10,000,000원 -> 일천만 원) 또는 콤마 포맷팅이 시각적으로 명확하게 드러나야 합니다.
* **보안 및 규정**: 상담 메모는 고객 개인정보(주민등록번호, 계좌번호 전체 등)를 직접 저장하지 않도록 사용자 가이드를 제공하거나 프론트엔드 단에서 마스킹 처리를 권장합니다.

---
---

# [TRD] 기술 요구사항 정의서 (Technical Requirement Document)

## 1. 시스템 아키텍처 및 기술 스택 (System Architecture & Tech Stack)

### 1.1. 개발 프레임워크 및 라이브러리
* **Language & Runtime**: TypeScript 5.x, Node.js (Vite 환경)
* **Frontend Library**: React 19 (또는 React 18 안정화 버전)
* **Build Tool**: Vite
* **Styling**: TailwindCSS (Utility-first CSS)
* **State Management**:
  * 로컬 UI 상태: React `useState`, `useReducer`
  * 동기화 상태: `localStorage` wrapper hook 또는 Supabase Client State
* **Database (Cloud)**: Supabase (PostgreSQL) - 상담 메모 저장용
* **Testing**: Vitest, React Testing Library (TDD 기반 테스트 코드 작성)
* **Deployment**: Vercel

### 1.2. 아키텍처 다이어그램 (논리적 구조)
```
[ Browser / Client ]
  ├─ React Components (Dashboard, LoanCalculator, MemoManager, SavingsCalculator)
  ├─ Hooks / Utils (useLocalStorage, loanCalcEngine, savingsCalcEngine)
  └─ Global / Shared State
        ├─ LocalStorage (Fallback / Offline)
        └─ Supabase Client (Cloud DB) ──> [ Supabase Cloud Service ]
```

---

## 2. 데이터 모델 및 스키마 설계 (Data Model & Schema)

### 2.1. 상담 메모 데이터 구조 (Local / Cloud 공통)
* **테이블명 / 객체 키**: `memos`

| 필드명 | 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | `string` (UUID) | PK | 메모 식별 고유 ID |
| `title` | `string` | NOT NULL | 고객명 또는 상담 요약 제목 |
| `content` | `text` | NOT NULL | 구체적인 상담 메모 내용 |
| `created_at` | `timestamp` | DEFAULT now() | 생성 일시 |
| `updated_at` | `timestamp` | DEFAULT now() | 최종 수정 일시 |

---

## 3. 핵심 비즈니스 로직 및 계산 공식 (Core Logic Specifications)

### 3.1. 원리금균등상환 계산 공식 (Equal Payment of Principal and Interest)
* **정의**: 대출 원금과 총 이자를 합산한 금액을 대출 기간 동안 매달 균등하게 분할하여 상환하는 방식
* **변수**:
  * $P$ : 대출 원금 (Principal)
  * $R$ : 월 이자율 (연이자율 / 12 / 100)
  * $N$ : 대출 기간 (개월수)
* **월 상환액 ($M$) 공식**:
  $$M = P \times \frac{R(1 + R)^N}{(1 + R)^N - 1}$$
  *(단, 이자율 $R = 0$일 경우에는 $M = P / N$)*

* **월별 상세 스케줄 계산 로직 (Loop $t = 1$ to $N$):**
  1. **회차별 이자 ($I_t$)**: $I_t = \text{잔액}_{t-1} \times R$
  2. **회차별 납입원금 ($P_t$)**: $P_t = M - I_t$
  3. **회차별 상환 후 원금 잔액 ($B_t$)**: $B_t = B_{t-1} - P_t$
  4. *마지막 회차 ($t = N$)* 에는 잔액 오차를 조정하기 위해 납입원금을 잔액 전액으로 처리하고 잔액을 0원으로 맞춥니다.

### 3.2. 예적금 만기 수령액 계산 공식
* **단리(Simple Interest) 적금**:
  $$\text{총 이자} = \text{월납입액} \times \frac{N(N + 1)}{2} \times \frac{\text{연이율}}{12}$$
* **복리(Compound Interest) 적금 (월 복리 기준)**:
  $$\text{만기 금액} = \text{월납입액} \times \sum_{k=1}^{N} (1 + R)^k$$

---

## 4. 컴포넌트 및 인터페이스 설계 (Component & Interface Design)

### 4.1. 컴포넌트 계층 구조
```
src/
├── components/
│   ├── Dashboard.tsx          # 전체 레이아웃 및 탭 관리
│   ├── LoanCalculator.tsx     # 대출 상환 계산기 (입력, 요약, 스케줄 표)
│   ├── SavingsCalculator.tsx  # 예적금 계산기 (단리/복리 선택 탭 포함)
│   ├── MemoManager.tsx        # 상담 메모 목록, 추가/삭제, 검색 필드
│   └── common/
│       └── ToggleDarkMode.tsx # 다크모드 스위치
├── hooks/
│   ├── useLocalStorage.ts     # 로컬스토리지 싱크 커스텀 훅
│   └── useMemos.ts            # Supabase 연동 및 로컬 폴백 지원 훅
├── utils/
│   ├── loanCalculator.ts      # 대출 계산 함수 엔진
│   ├── savingsCalculator.ts   # 예적금 계산 함수 엔진
│   └── formatter.ts           # 천 단위 구분자 및 '원' 단위 포맷터
└── __tests__/
    ├── loanCalculator.test.ts # 계산 로직 검증용 테스트 코드
    └── savingsCalculator.test.ts
```

### 4.2. 주요 API 및 유틸리티 함수 시그니처
```typescript
// utils/loanCalculator.ts
export interface LoanScheduleRow {
  seq: number;          // 회차
  payment: number;      // 월 상환액 (원리금)
  principal: number;    // 납입원금
  interest: number;     // 이자
  balance: number;      // 상환 후 잔액
}

export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: LoanScheduleRow[];
}

export function calculateLoan(
  principal: number,
  annualRate: number,
  months: number
): LoanResult;
```

---

## 5. 테스트 전략 (Testing Strategy)

### 5.1. 테스트 프레임워크: Vitest
* 단위 테스트를 통하여 복잡한 세금 및 소수점 자리 계산 시 발생할 수 있는 부동 소수점 오차를 사전에 검증합니다.
* **TDD 기반 테스트 케이스 예시 (대출 계산 검증)**:
  * 예시 입력값: 대출금 10,000,000원, 연이율 6.0%, 기간 12개월
  * 기대 결과값 계산 검증:
    * 월 상환액: 약 860,664원 (원리금균등분할 수식 검증)
    * 마지막 회차의 잔액이 정확히 0원으로 수렴하는지 여부 검증

```typescript
// __tests__/loanCalculator.test.ts
import { describe, it, expect } from 'vitest';
import { calculateLoan } from '../utils/loanCalculator';

describe('대출 상환 계산기 비즈니스 로직 테스트', () => {
  it('원리금균등상환 방식으로 정상적인 월 상환액을 산출해야 한다.', () => {
    const result = calculateLoan(10000000, 6, 12);
    
    expect(result.monthlyPayment).toBeCloseTo(860664, -1); // 오차 범위 내 근사치 검증
    expect(result.schedule).toHaveLength(12);
    expect(result.schedule[11].balance).toBe(0); // 마지막 회차 잔액은 0이어야 함
  });
});
```

---

## 6. 개발 및 배포 파이프라인 (Deployment & CI/CD Pipeline)

* **소스 코드 관리**: GitHub Repository 사용
* **지속적 통합(CI)**: GitHub Actions 연동으로 Push 혹은 PR 생성 시 `npm run test` 및 `npm run build`를 자동 실행하여 빌드 오류 사전 차단
* **호스팅 및 클라우드 배포**:
  * **프론트엔드**: Vercel 플랫폼 연동으로 `main` 브랜치 업데이트 시 자동 빌드 및 배포 처리하여 실제 구동 가능한 URL 확보
  * **백엔드/DB**: Supabase 프로젝트 생성 및 SQL 스키마 세팅 후 프론트엔드에 `SUPABASE_URL` 및 `SUPABASE_ANON_KEY` 환경 변수 주입