# Projects — proposed API extension

The backend currently models `Client` plus its `Phone` and `Address` sub-resources (see the
main API doc). This proposes how a `Project` resource could extend that, following the same
conventions (base path, RFC 7807 errors, `Pageable`, opaque IDs).

## Where it sits relative to Client

Phones and addresses are sub-resources because they're pure attributes of a client — no
independent lifecycle, no identity outside "belongs to this client." A Project is different: it
likely has its own lifecycle (status changes over time, gets updated independently, maybe
eventually has assignees, due dates, activity history) even though it always belongs to one
client. That argues for `/api/v1/clients/{clientId}/projects` as the creation/listing path
(consistent with the existing pattern, and matches how the frontend already scopes things —
admin lists per-client, portal only ever sees its own client's projects) but with the resource
being closer in weight to `Client` itself than to `Phone`/`Address`.

## Proposed shape

Building on what the frontend already mocks:

```
Project
- id            (opaque)
- clientId
- name
- status        (enum — see below)
- description   (optional)
- createdAt
- updatedAt
```

## Status enum

The frontend currently mocks `planning | in_progress | blocked | review | done`. Worth deciding
now since it's a DB enum/check-constraint on the backend: is this fixed, or does the agency want
custom stages per engagement type later? Fixed enum is simpler and matches Bean Validation's
`@NotNull` + enum pattern cleanly; a custom-stages model would need a separate `ProjectStage`
concept, more like a lightweight workflow engine — probably overkill unless you already know you
need it.

## Endpoints

Mirroring Phones/Addresses exactly:

| Method | Path | Status |
|---|---|---|
| POST | `/api/v1/clients/{clientId}/projects` | 201 + `Location`, 400, 404 |
| GET | `/api/v1/clients/{clientId}/projects/{projectId}` | 200, 404 |
| GET | `/api/v1/clients/{clientId}/projects` | 200 (`Page<ProjectResponse>`) |
| PUT | `/api/v1/clients/{clientId}/projects/{projectId}` | 200, 400, 404 |
| DELETE | `/api/v1/clients/{clientId}/projects/{projectId}` | 204, 404 |

Same 404 rule as phones/addresses: a project id belonging to a *different* client than the path
returns 404, not 403 — that's the same principle already built into the mocked portal's
ownership check (a client hitting another client's project 404s, not leaks).

## Open questions

1. Fixed status enum, or does the agency need custom stages later?
2. Does a project ever need more than one client, or assignable staff — or is it strictly
   single-client, single-owner for now?
3. Is this something that's about to be added to the Spring Boot backend, or is it further out —
   should the frontend keep Projects fully mocked in the meantime regardless?
