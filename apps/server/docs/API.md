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

Returns all movements (income + outcome), with optional date filtering and optional pagination.

**Request**

```
GET /movements
```

**Query params**

| Param       | Type     | Required | Description |
|-------------|----------|----------|-------------|
| `startDate` | `string` | No       | Inclusive lower bound for `date`. Must be a valid ISO 8601 date. |
| `endDate`   | `string` | No       | Inclusive upper bound for `date`. Must be a valid ISO 8601 date. |
| `page`      | `number` | No       | 1-based page number. Must be a positive integer. Requires `limit`. |
| `limit`     | `number` | No       | Page size. Must be a positive integer. Requires `page`. |

No body.

**Examples**

```
GET /movements?startDate=2025-06-01T00:00:00.000Z&endDate=2025-06-30T23:59:59.999Z
GET /movements?page=2&limit=20
GET /movements?startDate=2025-06-01T00:00:00.000Z&endDate=2025-06-30T23:59:59.999Z&page=1&limit=10
```

**Response `200 OK`**

```json
[
  { "id": 1, "type": "income",  "amount": 2850, "description": "Monthly salary", "date": "2025-06-01T09:00:00.000Z" },
  { "id": 2, "type": "outcome", "amount": 85,   "description": "Groceries",      "date": "2025-06-03T10:00:00.000Z" }
]
```

> ~300 seeded entries on first load (12 months × ~25/month). Order reflects insertion order (seeded data is date-ascending; new entries appended). Date filters are inclusive. Pagination is only applied when both `page` and `limit` are provided; otherwise the endpoint returns every matching movement.

**Errors**

| Status | Body | Condition |
|--------|------|-----------|
| `400` | `{ "error": "startDate must be a valid ISO 8601 date" }` | Invalid `startDate` |
| `400` | `{ "error": "endDate must be a valid ISO 8601 date" }` | Invalid `endDate` |
| `400` | `{ "error": "startDate must be before or equal to endDate" }` | `startDate` is after `endDate` |
| `400` | `{ "error": "page must be a positive integer" }` | Invalid `page` |
| `400` | `{ "error": "limit must be a positive integer" }` | Invalid `limit` |
| `400` | `{ "error": "page and limit must be provided together" }` | Only one pagination param was provided |

---

## GET /income

Returns only movements where `type === "income"`, with the same optional date filtering and pagination query params as `/movements`.

**Request**

```
GET /income
```

**Query params**

| Param       | Type     | Required | Description |
|-------------|----------|----------|-------------|
| `startDate` | `string` | No       | Inclusive lower bound for `date`. Must be a valid ISO 8601 date. |
| `endDate`   | `string` | No       | Inclusive upper bound for `date`. Must be a valid ISO 8601 date. |
| `page`      | `number` | No       | 1-based page number. Must be a positive integer. Requires `limit`. |
| `limit`     | `number` | No       | Page size. Must be a positive integer. Requires `page`. |

No body.

**Examples**

```
GET /income?startDate=2025-06-01T00:00:00.000Z&endDate=2025-06-30T23:59:59.999Z
GET /income?page=1&limit=10
```

**Response `200 OK`**

```json
[
  { "id": 1, "type": "income", "amount": 2850, "description": "Monthly salary",   "date": "2025-06-01T09:00:00.000Z" },
  { "id": 5, "type": "income", "amount": 478,  "description": "Freelance payment","date": "2025-06-07T11:00:00.000Z" }
]
```

> Server-side filter: `movements.filter(m => m.type === 'income')`, then optional date filtering, then optional pagination. Date filters are inclusive. Pagination is only applied when both `page` and `limit` are provided.

**Errors**

| Status | Body | Condition |
|--------|------|-----------|
| `400` | `{ "error": "startDate must be a valid ISO 8601 date" }` | Invalid `startDate` |
| `400` | `{ "error": "endDate must be a valid ISO 8601 date" }` | Invalid `endDate` |
| `400` | `{ "error": "startDate must be before or equal to endDate" }` | `startDate` is after `endDate` |
| `400` | `{ "error": "page must be a positive integer" }` | Invalid `page` |
| `400` | `{ "error": "limit must be a positive integer" }` | Invalid `limit` |
| `400` | `{ "error": "page and limit must be provided together" }` | Only one pagination param was provided |

---

## GET /outcome

Returns only movements where `type === "outcome"`, with the same optional date filtering and pagination query params as `/movements`.

**Request**

```
GET /outcome
```

**Query params**

| Param       | Type     | Required | Description |
|-------------|----------|----------|-------------|
| `startDate` | `string` | No       | Inclusive lower bound for `date`. Must be a valid ISO 8601 date. |
| `endDate`   | `string` | No       | Inclusive upper bound for `date`. Must be a valid ISO 8601 date. |
| `page`      | `number` | No       | 1-based page number. Must be a positive integer. Requires `limit`. |
| `limit`     | `number` | No       | Page size. Must be a positive integer. Requires `page`. |

No body.

**Examples**

```
GET /outcome?startDate=2025-06-01T00:00:00.000Z&endDate=2025-06-30T23:59:59.999Z
GET /outcome?page=3&limit=15
```

**Response `200 OK`**

```json
[
  { "id": 3, "type": "outcome", "amount": 85,   "description": "Groceries", "date": "2025-06-03T10:00:00.000Z" },
  { "id": 4, "type": "outcome", "amount": 1100, "description": "Rent",      "date": "2025-06-04T09:00:00.000Z" }
]
```

> Server-side filter: `movements.filter(m => m.type === 'outcome')`, then optional date filtering, then optional pagination. Date filters are inclusive. Pagination is only applied when both `page` and `limit` are provided.

**Errors**

| Status | Body | Condition |
|--------|------|-----------|
| `400` | `{ "error": "startDate must be a valid ISO 8601 date" }` | Invalid `startDate` |
| `400` | `{ "error": "endDate must be a valid ISO 8601 date" }` | Invalid `endDate` |
| `400` | `{ "error": "startDate must be before or equal to endDate" }` | `startDate` is after `endDate` |
| `400` | `{ "error": "page must be a positive integer" }` | Invalid `page` |
| `400` | `{ "error": "limit must be a positive integer" }` | Invalid `limit` |
| `400` | `{ "error": "page and limit must be provided together" }` | Only one pagination param was provided |

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
