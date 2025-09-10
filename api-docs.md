# API Documentation

## Base URL

```
/api
```

---

## Endpoints



### POST /users/signup
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
  - Body (JSON) :
    - id (string ou number, identifiant unique de l'utilisateur)
    - email (string, email utilisé pour la confirmation)
  - 400 Bad Request (erreur de validation)

### POST /auth/login
- Description : Connexion utilisateur.
- Body (JSON) :
  - email (string, requis, email)
  - password (string, requis)
- Réponse :
  - 200 OK (token ou session)
  - 401 Unauthorized (identifiants invalides)

### POST /profile
- Description : Création ou mise à jour du profil utilisateur après inscription.
- Headers :
  - Authorization: Bearer <token>
  - Content-Type: application/json
- Body (JSON) :
  - name (string, requis)
  - companyName (string, requis)
  - role (string, requis)
  - services (array[string], requis)
  - regions (array[string], requis)
  - employees (string, requis)
  - openingHours (object, requis)
    - monday (object) : { start: string, end: string }
    - tuesday (object) : { start: string, end: string }
    - wednesday (object) : { start: string, end: string }
    - thursday (object) : { start: string, end: string }
    - friday (object) : { start: string, end: string }
    - saturday (object) : { start: string, end: string }
    - sunday (object) : { start: string, end: string }
  - address (string, requis)
  - email (string, requis, email)
  - phone (string, optionnel)
  - website (string, optionnel)
  - socialNetworks (object, optionnel)
    - linkedin (string, optionnel)
    - facebook (string, optionnel)
    - instagram (string, optionnel)
    - x (string, optionnel)
  - pitch (string, optionnel)
- Réponse :
  - 200 OK
  - Body (JSON) :
    - success (boolean)
    - user (object) : profil mis à jour
  - 400 Bad Request (erreur de validation)
  - 401 Unauthorized (token manquant ou invalide)

### GET /dashboard/summary
- Description : Récupère les statistiques principales du dashboard pour l'utilisateur courant.
- Headers :
  - Authorization: Bearer <token>
- Réponse :
  - 200 OK
  - Body (JSON) :
    - total_leads (number) : Nombre total de leads générés
    - sent_mails (number) : Nombre total d'emails envoyés
  - Exemple de réponse :
```json
{
  "total_leads": 1200,
  "sent_mails": 300
}
```
- 401 Unauthorized (si token manquant ou invalide)

### GET /dashboard/missions
- Description : Récupère la liste des missions de l'utilisateur courant pour affichage sur le dashboard.
- Headers :
  - Authorization: Bearer <token>
- Réponse :
  - 200 OK
  - Body (JSON) : tableau d'objets mission
    - id (number) : Identifiant unique de la mission
    - name (string) : Nom de la mission
    - status (string) : Statut ('active', 'completed', 'draft')
    - progress (number) : Pourcentage d'avancement (0-100)
    - leads (number) : Nombre de leads générés
    - target (number) : Objectif de leads
    - lastUpdated (string) : Date ou texte de dernière mise à jour
- Exemple de réponse :
```json
[
  {
    "id": 1,
    "name": "Tech SaaS in California",
    "status": "active",
    "progress": 65,
    "leads": 87,
    "target": 150,
    "lastUpdated": "2025-07-09T10:00:00Z"
  },
  {
    "id": 2,
    "name": "UK Startups",
    "status": "completed",
    "progress": 100,
    "leads": 120,
    "target": 120,
    "lastUpdated": "2025-07-06T15:30:00Z"
  }
]
```
- 401 Unauthorized (si token manquant ou invalide)

### GET /missions/{id}
- Description : Récupère le détail d'une mission par son identifiant (les leads sont récupérés via un endpoint séparé).
- URL params :
  - id (number) : Identifiant unique de la mission
- Headers :
  - Authorization: Bearer <token>
- Réponse :
  - 200 OK
  - Body (JSON) :
    - id (number)
    - name (string)
    - target_location (string)
    - target_sector (string)
    - lead_count (number)
    - notes (string, optionnel)
    - progress (number)
    - created_at (string, ISO datetime)
    - status (string: 'active' | 'completed' | 'draft')
    - description (string, optionnel)
    - startDate (string)
    - lastUpdated (string)
    - stats (object) :
      - leadsFound (number)
      - contacted (number)
      - responded (number)
      - qualified (number)
    - target (object) :
      - industry (string)
      - location (string)
      - clientType (string)
      - leadTarget (number)
- Exemple de réponse :
```json
{
  "id": 1,
  "name": "Tech SaaS in California",
  "target_location": "California, USA",
  "target_sector": "SaaS",
  "lead_count": 87,
  "notes": "Mission prioritaire",
  "progress": 65,
  "created_at": "2025-07-09T10:00:00Z",
  "status": "active",
  "description": "Finding technology SaaS companies in California for potential partnerships.",
  "startDate": "Apr 2, 2025",
  "lastUpdated": "2 hours ago",
  "stats": {
    "leadsFound": 87,
    "contacted": 42,
    "responded": 18,
    "qualified": 12
  },
  "target": {
    "industry": "Technology",
    ""location": "California, USA",
    "clientType": "B2B",
    "leadTarget": 150
  }
}
```
- 401 Unauthorized (si token manquant ou invalide)
- 404 Not Found (si la mission n'existe pas)

### GET /missions/{id}/leads
- Description : Récupère la liste des leads associés à une mission.
- URL params :
  - id (number) : Identifiant unique de la mission
- Headers :
  - Authorization: Bearer <token>
- Réponse :
  - 200 OK
  - Body (JSON) : tableau d'objets lead
    - id (number)
    - companyName (string)
    - industry (string)
    - location (string)
    - score (number)
    - email (string, optionnel)
    - phone (array[string], optionnel)
    - reason (string, optionnel)
    - status (string)
- Exemple de réponse :
```json
[
  {
    "id": 1,
    "companyName": "TechFlow Solutions",
    "industry": "Software",
    "location": "San Francisco, CA",
    "score": 95,
    "email": "contact@techflow.com",
    "phone": ["+1-555-1234"],
    "reason": "Intéressé par une démo",
    "status": "pending"
  },
  {
    "id": 2,
    "companyName": "CloudNova",
    "industry": "Cloud Services",
    "location": "Los Angeles, CA",
    "score": 88,
    "email": null,
    "phone": [],
    "reason": null,
    "status": "contacted"
  }
]
```
- 401 Unauthorized (si token manquant ou invalide)
- 404 Not Found (si la mission ou les leads n'existent pas)

### GET /leads/{id}/generate-message
- Description : Génère un message de contact personnalisé par l'IA pour un lead spécifique.
- URL params :
  - id (number) : Identifiant unique du lead
- Headers :
  - Authorization: Bearer <token>
- Réponse :
  - 200 OK
  - Body (JSON) :
    - generatedMessage (string) : Le message de contact généré par l'IA.
- Exemple de réponse :
```json
{
  "generatedMessage": "Bonjour [Nom de l'entreprise],\n\nJe suis tombé sur votre entreprise et j'aimerais discuter de la manière dont notre solution pourrait être précieuse pour votre activité.\n\nCordialement,\n[Votre Nom]"
}
```
- 401 Unauthorized (si token manquant ou invalide)
- 404 Not Found (si le lead n'existe pas)

### PUT /leads/{id}/contact-status
- Description : Met à jour le statut de contact et le message brouillon d'un lead.
- URL params :
  - id (number) : Identifiant unique du lead
- Headers :
  - Authorization: Bearer <token>
  - Content-Type: application/json
- Body (JSON) :
  - contact_status (string, requis) : Nouveau statut de contact ('draft' ou 'sent').
  - draft_message (string, optionnel) : Le message brouillon actuel ou le message envoyé.
- Réponse :
  - 200 OK
  - Body (JSON) :
    - success (boolean) : Indique si la mise à jour a réussi.
    - lead (object) : L'objet lead mis à jour.
- Exemple de réponse :
```json
{
  "success": true,
  "lead": {
    "id": 1,
    "companyName": "TechFlow Solutions",
    "contact_status": "draft",
    "draft_message": "This is a draft message for TechFlow Solutions."
    // ... autres propriétés du lead
  }
}
```
- 400 Bad Request (erreur de validation)
- 401 Unauthorized (si token manquant ou invalide)
- 404 Not Found (si le lead n'existe pas)
