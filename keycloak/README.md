# Keycloak Redirect URIs (BFF)

After migrating to BFF auth, each client must allow the **BFF callback** URL (not only the old frontend `/auth/callback`).

## Client: `factory-portal`

Add to **Valid redirect URIs** in Keycloak Admin (`http://localhost:7890`):

```
http://localhost:4200/api/bff/auth/callback
http://localhost:4200/*
```

**Valid post logout redirect URIs:**

```
http://localhost:4200/login
http://localhost:4200/*
```

## Client: `app-1`

Add to **Valid redirect URIs**:

```
http://localhost:4201/api/bff/auth/callback
http://localhost:4201/*
```

**Valid post logout redirect URIs:**

```
http://localhost:4201/login
http://localhost:4201/*
```

## Why tile SSO fails with `Invalid parameter: redirect_uri`

app-1 silent SSO sends:

```
redirect_uri=http://localhost:4201/api/bff/auth/callback
```

If Keycloak client `app-1` only has the old URI `http://localhost:4201/auth/callback`, login will fail.

## Admin steps

1. Open Keycloak Admin → Realm **toyota** → Clients → **app-1**
2. Settings → **Valid redirect URIs** → add `http://localhost:4201/api/bff/auth/callback`
3. Save
4. Retry opening app-1 from factory portal tile

If you use realm import from `realm-toyota.json`, reset Keycloak volume once so import runs on a fresh database:

```powershell
cd factory_portal
docker compose down
docker volume rm factory_portal_keycloak_data
docker compose up -d
```
