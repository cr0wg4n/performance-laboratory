# API Contracts

Base URL: `http://localhost:3000`  
No auth. In-memory storage — state resets on server restart.

---

## Shared Types

### Movement

```ts
{
  id: number           // auto-incremented integer
  type: "income" | "outcome"
  amount: number       // positive, > 0
  description: string
  date: string         // ISO 8601 UTC, e.g. "2025-06-01T09:00:00.000Z"
}
```

### User

```ts
{
  id: number
  name: string
  email: string
  currency: string     // e.g. "USD"
  balance: number      // computed: sum(income.amount) - sum(outcome.amount)
}
```

---

## GET /me

Returns the current user profile with computed balance.

**Request**

```
GET /me
```

No query params. No body.

**Response `200 OK`**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "currency": "USD",
  "balance": 4823.00
}
```

> `balance` is computed on the fly from all movements — not a stored field. No error cases.

---

## GET /movements

Returns all movements (income + outcome), unfiltered.

**Request**

```
GET /movements
```

No query params. No body.

**Response `200 OK`**

```json
[
  { "id": 1, "type": "income",  "amount": 2850, "description": "Monthly salary", "date": "2025-06-01T09:00:00.000Z" },
  { "id": 2, "type": "outcome", "amount": 85,   "description": "Groceries",      "date": "2025-06-03T10:00:00.000Z" }
]
```

> ~300 seeded entries on first load (12 months × ~25/month). No pagination, filtering, or sorting params. Order reflects insertion order (seeded data is date-ascending; new entries appended).

---

## GET /income

Returns only movements where `type === "income"`.

**Request**

```
GET /income
```

No query params. No body.

**Response `200 OK`**

```json
[
  { "id": 1, "type": "income", "amount": 2850, "description": "Monthly salary",   "date": "2025-06-01T09:00:00.000Z" },
  { "id": 5, "type": "income", "amount": 478,  "description": "Freelance payment","date": "2025-06-07T11:00:00.000Z" }
]
```

> Server-side filter: `movements.filter(m => m.type === 'income')`. No error cases.

---

## GET /outcome

Returns only movements where `type === "outcome"`.

**Request**

```
GET /outcome
```

No query params. No body.

**Response `200 OK`**

```json
[
  { "id": 3, "type": "outcome", "amount": 85,   "description": "Groceries", "date": "2025-06-03T10:00:00.000Z" },
  { "id": 4, "type": "outcome", "amount": 1100, "description": "Rent",      "date": "2025-06-04T09:00:00.000Z" }
]
```

> Server-side filter: `movements.filter(m => m.type === 'outcome')`. No error cases.

---

## POST /movements

Creates a new movement and appends it to the in-memory store.

**Request**

```
POST /movements
Content-Type: application/json
```

```json
{
  "type": "income",
  "amount": 500,
  "description": "Freelance payment"
}
```

| Field         | Type                       | Required | Validation                                |
|---------------|----------------------------|----------|-------------------------------------------|
| `type`        | `"income"` \| `"outcome"` | Yes      | Must be exactly `"income"` or `"outcome"` |
| `amount`      | `number`                   | Yes      | Must be a positive number (`> 0`)         |
| `description` | `string`                   | Yes      | Must be a non-empty truthy string         |

**Response `201 Created`**

```json
{
  "id": 302,
  "type": "income",
  "amount": 500,
  "description": "Freelance payment",
  "date": "2026-06-21T14:35:00.123Z"
}
```

`id` is auto-incremented. `date` is server-assigned (`new Date().toISOString()`).

**Errors**

| Status | Body                                       | Condition              |
|--------|--------------------------------------------|------------------------|
| `400`  | `{ "error": "type must be income or outcome" }` | Invalid `type`    |
| `400`  | `{ "error": "amount must be a positive number" }` | Invalid `amount` |
| `400`  | `{ "error": "description is required" }`   | Missing `description`  |

> Validation runs in order: `type` → `amount` → `description`. First failure returns immediately.

---

## DELETE /movements/:id

Removes a movement by ID and returns the deleted record.

**Request**

```
DELETE /movements/42
```

| Param | In   | Type     | Description                  |
|-------|------|----------|------------------------------|
| `id`  | path | `number` | ID of the movement to delete |

No body.

**Response `200 OK`**

Returns the deleted movement object (same shape as Movement type above).

```json
{
  "id": 42,
  "type": "outcome",
  "amount": 85,
  "description": "Groceries",
  "date": "2025-06-03T10:00:00.000Z"
}
```

**Errors**

| Status | Body                              | Condition           |
|--------|-----------------------------------|---------------------|
| `404`  | `{ "error": "movement not found" }` | ID does not exist |

> `:id` parsed with `Number()` — non-numeric strings become `NaN`, never match, return `404`. No soft-delete.
