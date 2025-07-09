# API Documentation

## Base URL

```
/api
```

---

## Endpoints (à compléter selon vos routes)

### POST /signup
- Description : Inscription d'un nouvel utilisateur/prospect.
- Body (JSON) :
  - name (string, requis)
  - companyName (string, requis)
  - role (string, requis)
  - services (array[string], requis)
  - regions (array[string], requis)
  - employees (string, requis)
  - openingHours (object, requis)
  - address (string)
  - email (string, requis, email)
  - phone (string)
  - website (string, optionnel)
  - linkedin (string, optionnel)
  - facebook (string, optionnel)
  - instagram (string, optionnel)
  - x (string, optionnel)
  - pitch (string, optionnel)
  - password (string, requis, min 8)
  - confirmPassword (string, requis, doit correspondre à password)
- Réponse :
  - 201 Created ou 200 OK
  - 400 Bad Request (erreur de validation)

### POST /login
- Description : Connexion utilisateur.
- Body (JSON) :
  - email (string, requis, email)
  - password (string, requis)
- Réponse :
  - 200 OK (token ou session)
  - 401 Unauthorized (identifiants invalides)

> Ajoutez ici la documentation de vos autres routes, paramètres, réponses, statuts, etc.
