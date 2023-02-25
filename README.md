# Yonsei Computer Club Registration

This is a registration system for Yonsei Computer Club.

## Setup

### 1. Create a Google API project and get credentials

1. Visit [Google Cloud Console](https://console.cloud.google.com/) and create a new project.
2. Go to the "APIs & Services" tab.
3. Set up the OAuth consent screen.
4. Create a new OAuth client ID.
5. Download the credentials file and put it to the `credentials.json` file.

### 2. Get credentials from FreeIPA and set up FreeIPA

Send a request to FreeIPA to get a token.

- URL: `https://<your FreeIPA server>/ipa/session/login_password`
- Method: `POST`
- Headers:
  - `Accept`: `text/plain`
  - `Content-Type`: `application/x-www-form-urlencoded`
  - `Referer`: `https://<your FreeIPA server>/ipa/session/login_password`

Copy `ipa_session` cookie value from the response and put it to the `IPA_SESSION_COOKIE` environment variable.

### 3. Set up the application

Put these environment variables to the `.env` file.

- next-auth related
  - `NEXTAUTH_URL`: The URL of your application
  - `NEXTAUTH_SECRET`: A secret string. Recommended to use `openssl rand -hex 32`
- FreeIPA Server related
  - `IPA_SERVER_URL`: The URL of your FreeIPA server
  - `IPA_SERVER_COOKIE`: The `ipa_session` cookie value you got from FreeIPA

## Usage

```bash
docker compose up -d
```

## Customization

### 1. Change the logo and the favicon

Change the asset in `public/` folder

### 2. Change the GitHub Repo

Set the `GITHUB_REPO` environment variable.
