# Vehicle Search Feature Options

Below are five architectural options to add a vehicle search capability (filter by price, color, make, and combinations), plus considerations for an AI-powered variant. Each option includes pros, cons, estimated complexity, and references.

## Option 1: Simple REST Query Parameters (Server Filter)
**Approach:** Expose an endpoint like `GET /api/vehicles?maxPrice=5000&color=red&make=Toyota` that accepts multiple filters. The backend translates params into a DB query with safe parameterization.

- **Pros:** Straightforward; cacheable; easy to secure and test; minimal UI change (build query string from form).
- **Cons:** Less flexible for free-text; complex predicates (ranges, multi-select) can bloat query strings; no relevance ranking.
- **Complexity:** Low for both FE and BE if models and repo patterns already exist; moderate if pagination/sorting added.
- **Research:**
  - REST filtering patterns: https://restfulapi.net/resource-naming/
  - NestJS/ASP.NET/Node filtering examples (generic): https://martinfowler.com/articles/richardsonMaturityModel.html

## Option 2: POST-based Filter DTO (Structured Body)
**Approach:** Use `POST /api/vehicles/search` with a JSON payload (e.g., `{ price: { lte: 5000 }, colors: ["red","blue"], make: "Toyota" }`). Supports AND/OR, ranges, pagination, sort.

- **Pros:** Clean, extensible schema; easier to evolve; supports complex logic (e.g., OR groups, multiple ranges) without URL limits; good for versioning.
- **Cons:** Less cacheable via CDNs; needs request schema validation; slightly more FE work to build the payload.
- **Complexity:** Low-moderate; backend needs DTO validation and query builder mapping; FE just maps form state to JSON.
- **Research:**
  - JSON API filtering ideas: https://jsonapi.org/recommendations/
  - Zod / class-validator patterns: https://github.com/colinhacks/zod

## Option 3: Search Index (Elasticsearch/OpenSearch/Algolia)
**Approach:** Sync vehicles into a search index; query via search API with filters and full-text. Use aggregations for facets (price ranges, colors, makes).

- **Pros:** Fast, scalable search; relevance scoring; typo tolerance (if supported); facets out of the box; good developer tooling.
- **Cons:** Extra infra and ops; data sync and consistency concerns; cost; need mapping and analyzers to match languages.
- **Complexity:** Moderate-high; requires ingestion pipeline and index lifecycle; FE adds facet UI but can reuse current filters.
- **Research:**
  - OpenSearch filters and aggregations: https://opensearch.org/docs/latest/search-plugins/sql/index/
  - Algolia faceting: https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/

## Option 4: Database Full-Text + Filtered Queries
**Approach:** Stay on the primary DB but use full-text search (Postgres `tsvector`, SQL Server `CONTAINS`) combined with structured filters for price/make/color.

- **Pros:** No new infra; transactional consistency; good enough relevance for many use cases; simpler ops than a dedicated search cluster.
- **Cons:** Limited relevance tuning; can be slower at scale; fewer advanced features (synonyms, typo tolerance) without extensions.
- **Complexity:** Moderate; requires indexes, migrations, and query updates; FE unchanged besides maybe a free-text box.
- **Research:**
  - Postgres full-text search: https://www.postgresql.org/docs/current/textsearch.html
  - SQL Server full-text search: https://learn.microsoft.com/sql/relational-databases/search/full-text-search

## Option 5: AI Retrieval Layer (Semantic / NL to Filters)
**Approach:** Add an AI service that turns natural-language prompts (e.g., "cheap red hybrids under 5k") into structured filters, then queries the DB or search index. Could also use a vector index for semantic similarity on descriptions.

- **Pros:** Natural language UX; can handle fuzzy intents; semantic matching on descriptions/options; differentiating feature.
- **Cons:** New failure modes; model cost; guardrails for unsafe prompts; needs evaluation harness; accuracy depends on metadata quality; latency considerations.
- **Complexity:** High; requires prompt/schema design, vector store or NL-to-SQL/filters pipeline, safety checks, and fallbacks.
- **Research:**
  - OpenAI structured outputs: https://platform.openai.com/docs/guides/structured-outputs
  - NL to SQL patterns: https://arxiv.org/abs/2005.04394
  - Retrieval patterns overview: https://hamel.dev/blog/posts/rag

## Recommendation Snapshot
- **Start** with Option 2 (POST DTO) for flexibility and clarity; add pagination, sorting, and validation.
- **Optimize** with targeted indexes on price, make, color, year, mileage. Consider DB full-text (Option 4) for descriptions.
- **Scale/UX** to Option 3 if you need facets, typo tolerance, or large catalogs.
- **Experiment** with Option 5 as an additive UX (not a replacement) with explicit user confirmation of parsed filters.

## Implementation Notes
- **DTO example (Option 2):**
  ```json
  {
    "price": { "lte": 5000 },
    "make": "Toyota",
    "colors": ["red", "blue"],
    "year": { "gte": 2015 },
    "page": 1,
    "pageSize": 20,
    "sort": [{ "field": "price", "direction": "asc" }]
  }
  ```
- **API contract:** Return `{ items, total, page, pageSize }`; keep numeric fields numeric; return applied filters for UI echo.
- **Security:** Validate and clamp page/pageSize; whitelist sortable fields; parameterize queries; rate-limit search.
- **Caching:** CDN cache GET (Option 1) or server cache keyed by DTO hash (Option 2); add ETag/Last-Modified.
- **Observability:** Log filter usage and slow queries; add tracing spans around search.
- **Testing:** Unit-test query builders; contract tests for DTO; load-test with realistic filters; evaluate AI parsing with golden datasets if Option 5 is used.
