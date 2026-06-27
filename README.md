# 영화 교집합 탐색기

감독, 주연, 장르를 조합하여 영화의 교집합을 찾아주는 웹앱입니다.

## TMDB API 키 발급

1. [TMDB](https://www.themoviedb.org/) 계정 생성
2. 로그인 후 **Settings** > **API** 이동
3. API Key (v3 auth) 복사

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.local.example .env.local
# .env.local 파일에 발급받은 API 키 입력

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 사용법

- **감독**: 감독 이름을 검색하여 선택
- **주연**: 배우 이름을 검색하여 선택
- **장르**: 드롭다운에서 장르 선택
- 최소 1개 조건을 입력한 후 **검색** 버튼 클릭
- 입력 조건에 따라 교집합 결과가 표시됩니다

## 기술 스택

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- TMDB API
