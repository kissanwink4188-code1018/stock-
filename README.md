# stock-dashboard (EquiDash)

## 1. 프로젝트 소개

Next.js App Router 기반의 **학습용** 미국 주식 정보 대시보드입니다. 메인 UI는 Google **Stitch**에서 생성한 EquiDash 디자인(다크 터미널 테마)과 통합되어 있습니다. 사용자가 회사명·티커 키워드로 종목을 검색하고, 선택한 티커에 대해 Finnhub API로 **주가 요약**과 **최근 뉴스(최대 50건, 최근 30일)**를 조회해 카드 형태로 보여줍니다. API 키는 서버 Route에서만 사용하며 클라이언트에 노출되지 않습니다.

## 2. 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 을 엽니다.

프로덕션 빌드:

```bash
npm run build
npm start
```

## 3. `.env.local` 설정 방법

1. 프로젝트 루트에 `.env.local` 파일을 만듭니다.
2. [Finnhub](https://finnhub.io)에서 발급한 API 키를 넣습니다.

```env
FINNHUB_API_KEY=여기에_발급받은_키
STITCH_API_KEY=여기에_Stitch_API_키
```

`.env.example` 을 참고할 수 있습니다. **API 키는 Git에 커밋하지 마세요.** 이 저장소의 `.gitignore`에 `.env*.local` 이 포함되어 있습니다.

## 4. 사용 예시 티커

검색어 예: `Apple`, `Microsoft`, `NVDA`, `AMZN`  
선택 후 조회 가능한 티커 예: `AAPL`, `MSFT`, `NVDA`, `AMZN`, `GOOGL`

## 5. 주요 기능

- **종목 검색**: 서버 Route `GET /api/search?q=` — Finnhub Symbol Search(미국 일반 주식 위주로 필터) 후 목록에서 티커 선택
- **주가 조회**: `GET /api/stock?symbol=` — Quote API 기반, 전일 대비·등락률은 서버에서 `현재가 - 전일종가`, `전일 대비 / 전일종가 × 100` 으로 계산
- **뉴스 조회**: `GET /api/news?symbol=` — Company News API, 최근 30일·최대 50건
- **오류·빈 입력 처리**: 검색어/티커 미입력, API 키 누락(503 및 안내), 네트워크 오류 시에도 UI 유지
- **Fallback**: Finnhub 호출 실패 시 `data/sampleData.ts` 기반 샘플 데이터 반환(`isFallback: true`)
- **로딩 표시**: 검색·조회 중 버튼 문구 및 카드 영역 로딩 문구
- **EquiDash 다크 UI**: `/` — Stitch 다크 모드 디자인(네이비·민트)과 동일한 레이아웃·토큰으로 검색·주가·뉴스 표시
- **Stitch 원본 비교**: `/design`, `/design/view` — Stitch HTML/스크린샷 미리보기 (`STITCH_API_KEY` 필요)

## 6. 학습 포인트

- App Router에서 **Route Handler**(`app/api/**/route.ts`)로 외부 API 프록시하기
- **환경 변수**는 서버에서만 읽어 API 키를 숨기기
- 클라이언트는 **자체 API**만 호출하고, Finnhub URL·토큰을 모르게 하기
- **타입스크립트**로 요청/응답 형태를 명확히 하기
- 실패 시 **샘플 데이터**로 수업·데모를 이어가는 패턴

## 7. 주의사항

- 본 프로젝트는 **교육 목적**이며, **투자 자문·매매 권유가 아닙니다.**
- Finnhub 무료 플랜에는 **호출 제한**이 있을 수 있습니다.
- 실시간 시세·뉴스의 정확성은 Finnhub 및 시장 상황에 따르며, 앱은 이를 보장하지 않습니다.
- 채팅 등 공개 채널에 API 키를 붙여 넣었다면 **키를 폐기하고 재발급**하는 것이 안전합니다.

## 8. GitHub 업로드 및 배포 (Vercel 권장)

이 프로젝트는 `/api/*` 서버 Route가 있어 **GitHub Pages만으로는 동작하지 않습니다.**  
코드는 GitHub에 올리고, **Vercel**(또는 Netlify 등 Next.js 호스팅)에 연결해 배포하는 방식을 권장합니다.

### 8-1. GitHub에 코드 올리기

터미널에서 프로젝트 폴더로 이동한 뒤:

```powershell
cd C:\DEV\stock대시보드

# GitHub CLI 로그인 (최초 1회)
gh auth login

# 저장소 생성 + 원격 연결 + 푸시 (한 번에)
gh repo create stock-dashboard --public --source=. --remote=origin --push
```

이미 GitHub 웹에서 저장소를 만들었다면:

```powershell
git remote add origin https://github.com/본인아이디/stock-dashboard.git
git push -u origin main
```

**저장소 URL 형식:** `https://github.com/<GitHub아이디>/stock-dashboard`

### 8-2. Vercel로 배포 (실제 접속 URL)

1. [vercel.com](https://vercel.com) 로그인 → **Add New Project**
2. GitHub의 `stock-dashboard` 저장소 **Import**
3. **Environment Variables**에 추가:
   - `FINNHUB_API_KEY` = Finnhub에서 발급한 키
   - `STITCH_API_KEY` = (선택) Stitch 디자인 페이지용
4. **Deploy** 클릭

배포가 끝나면 Vercel이 URL을 줍니다. 예:

- `https://stock-dashboard.vercel.app`
- 또는 `https://stock-dashboard-<랜덤>.vercel.app`

이후 `main` 브랜치에 push할 때마다 자동으로 재배포됩니다.

### 8-3. GitHub Actions (CI)

`.github/workflows/ci.yml` — push 시 `npm test`, `npm run build`를 실행합니다.

---

## 9. 테스트 체크리스트

- [ ] `.env.local` 없이 실행 시, 조회·검색 시 API 키 안내(503)가 표시되는가
- [ ] `.env.local` 설정 후 검색 → 종목 선택 → 조회하기 시 주가 카드에 숫자가 표시되는가
- [ ] 뉴스가 없을 때 「최근 뉴스를 찾을 수 없습니다.」가 보이는가
- [ ] 조회하기만 누르고 종목 미선택 시 「티커를 입력해주세요.」가 보이는가
- [ ] 검색어 없이 검색 시 안내 메시지가 보이는가
- [ ] 로딩 중 버튼·카드 영역에 진행 상태가 보이는가
- [ ] API 실패(또는 의도적 오류) 시 샘플 데이터 배지(`샘플 데이터`)가 표시되는가
- [ ] 하단 학습용 안내 문구가 항상 보이는가
- [ ] `npm test` 가 통과하는가
- [ ] Vercel에 `FINNHUB_API_KEY` 설정 후 배포 URL에서 검색·주가 조회가 되는가
