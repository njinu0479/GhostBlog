# ghost-blog

Ghost 블로그 운영을 위한 `docker-compose.yaml` 기반 리포지토리입니다.

## 구성

- `docker-compose.yaml`: Ghost + MySQL + Umami(Postgres) + Waline
- `content/themes/tistory-style/`: 커스텀 Ghost 테마 소스(이 리포지토리에서 관리)
- `content/*` (그 외): 런타임 데이터(업로드/이미지/로그 등). Git에 커밋하지 않습니다.
- `db/`, `*-data/`: DB 볼륨(로컬 런타임 데이터). Git에 커밋하지 않습니다.

## 시작하기

1. `.env.example`을 `.env`로 복사해서 값 채우기
2. 실행

```bash
docker compose up -d
```

## 테마 개발

커스텀 테마는 `content/themes/tistory-style/` 아래에서 관리합니다.

- 스타일: `assets/css/tistory-style.css`
- 스크립트: `assets/js/tistory-style.js`
- 레이아웃: `default.hbs` (자산 로딩만 담당)

