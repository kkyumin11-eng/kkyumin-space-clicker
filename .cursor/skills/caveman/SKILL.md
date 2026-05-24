---
name: caveman
description: >-
  Stardust Clicker 버그 수정 및 프로젝트 유지보수. 곱연산 미적용, 강화 이름 불일치,
  기타 회귀 버그를 찾아 고침. /caveman 또는 Stardust Clicker 버그·밸런스·회귀 수정
  요청 시 사용.
disable-model-invocation: true
---

# /caveman

지금 곱연산이 제대로 적용이 안되는 버그와, 강화 이름이 이전과 다른 버그를 수정해줘. 또 다른 버그가 있을 수도 있으니까 그것도 알아서 고쳐줘

## 말투

프로젝트 규칙 `.cursor/rules/01-caveman.mdc` 따름. 짧은 조각문. 기술 정확도 유지.

## 대상 파일

- `script.js` — 게임 로직, 스탯, 상점
- `index.html` — 상점·HUD 라벨 (초기값)
- `style.css` — UI (로직 버그 아님, 중복·표시 깨짐만)

## 알려진 버그 패턴

### 1. 곱연산 미적용 (`getClickGain`)

**증상:** 카드·피버·DM 곱배율 올려도 클릭 획득량이 기대만큼 안 오류.

**원인:** `compressStardustFromMultiplier(rawMult) + flat` — 배율을 `log10`으로 압축해 **flat에 곱하지 않음**.

**수정:**

```javascript
function getClickGain(extraDamageMultiplier = 1) {
  const flat = getClickFlatBonus();
  const rawMult = getRawClickMultiplier() * Math.max(1, Number(extraDamageMultiplier) || 1);
  return flat * rawMult;
}
```

`buildStatSnapshot`의 `clickGain`도 동일: `flat * rawMult`.

`compressStardustFromMultiplier` / `STARDUST_LOG_SCALE` — 위 수정 후 미사용이면 제거.

**검증:** 배율 x2 → flat 10이면 획득 20. 피버·웜홀·중력·카드 %가 **곱**으로 반영.

### 2. 강화 이름 (환생상점 스타일)

**형식:** `특이점 압축`·`웜홀 엔진`처럼 고정 우주 테마명 + `가격: … | 보유: …`

| 상품 | 이름 |
|------|------|
| 클릭 고정 +2 | 스타더스트 주입 |
| 클릭 XP +10 | 광자 학습기 |
| 크리 확률 | 확률 렌즈 |
| 크리 배율 | 초신성 코어 |

제목에 `Lv.` 붙이지 않음. 레벨은 `보유` span.

### 3. 추가 점검

수정 후 스스로 확인:

- [ ] `getClickXpGain` — `baseXp * xpFactor` (이미 곱셈, 보통 OK)
- [ ] `getBurstGainFromClicks` — `getClickGain() * clickCount`
- [ ] 크리 — `getClickGain(getCriticalMultiplier())`로 전체에 크리 배율
- [ ] `loadState` 후 `recalculateCardBuffs()` 호출됨
- [ ] `style.css` 동일 블록 중복 (`.growth-light-*`, `.preservation-*` 등)

## 작업 순서

1. `script.js`에서 `getClickGain`, `buildStatSnapshot`, `updateView` 제목 읽기
2. 곱연산·이름 버그 수정
3. grep으로 `compressStardust`, `Title.textContent`, 중복 CSS 검색
4. 브라우저 또는 Node로 핵심 수식 스팟 체크 (선택)
5. caveman 말투로 무엇 고쳤는지 짧게 보고

## 하지 말 것

- 요청 없이 git commit/push
- 상점·카드 밸런스 임의 변경
- README 등 사용자가 안 요청한 문서 추가
