## GhostBlog

Ghost + 주변 서비스들을 `docker-compose.yaml`로 묶어둔 개인 블로그 운영 repo입니다.
커스텀 테마는 `content/themes/tistory-style/`에서 관리합니다.

### 프로젝트 소개

아카이브용 Ghost 블로그를 운영하면서 필요한 서비스(MySQL, Umami, Waline)를 Compose로 묶어 한 번에 재현 가능하게 구성했습니다.  
비밀값은 `.env`로 분리하고, DB/업로드 같은 런타임 데이터는 Git에서 제외해 운영 중 실수로 올라가지 않게 했습니다.

### 뭐가 올라가 있나

- `docker-compose.yaml`: Ghost / MySQL / Umami(Postgres) / Waline
- `content/themes/tistory-style/`: 테마 소스(커밋됨)
- `content/*`(테마 제외), `db/`, `*-data/`: 런타임 데이터(커밋 안 함)

### 실행

1) `.env` 만들기

```bash
cp .env.example .env
```

2) `.env` 값 채우기 (필수/선택)

- `GHOST_DB_PASSWORD`
- `GMAIL_APP_PASSWORD` (메일 발송 쓸 때만)
- `UMAMI_DB_PASSWORD`, `UMAMI_SECRET`

3) 올리기

```bash
docker compose up -d
```

자주 쓰는 명령:

```bash
make up
make logs
make down
```

### 테마

`default.hbs`는 레이아웃 + 자산 로딩만 하고, CSS/JS는 assets로 분리해놨습니다.

- `assets/css/tistory-style.css`
- `assets/js/tistory-style.js`
- `default.hbs`

### 커밋/보안

- `.env`는 커밋되지 않게 막아뒀습니다. 공유할 땐 `.env.example`만 사용합니다.
- DB/업로드 같은 런타임 데이터(`db/`, `*-data/`, `content/*`)도 커밋하지 않습니다.

