# Generic Resource Schema

This schema provides a **fully generic structure** for querying any type of resource, such as cars, electronics, real estate, jobs, or products. It is designed as a **placeholder** that can be customized for your domain.  

> **Important:** All fields, filters, categories, subtypes, attributes, and examples provided in this schema are **just for illustration purposes**. You should replace them with values that fit your specific resource or domain.

The schema includes:

- **Resource metadata** (title, description, example queries)
- **Definitions (`$defs`)** for categories, subtypes, attributes, and numeric ranges
- **Filters** to narrow down resources (all are example filters)
- **Features** to specify which resource attributes to retrieve (all are example attributes)  

---

## File: `resource.json`

### Top-level fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Human-readable title of the resource. Example: `"Generic Resource"`. Can be customized. |
| `description` | string | Explains the purpose of this resource schema and its usage. Edit as needed. |
| `embeddingExamples` | array of strings | Example natural language queries the schema is designed to handle. Fully generic and **placeholder examples**, e.g., `"Show me resources with specific features."` |

---

### `$defs` (Definitions)

These are reusable definitions for filtering and features. **All examples here are placeholders and should be customized**:

| Key | Type | Description |
|-----|------|-------------|
| `categories` | string | High-level groups of resources. Example placeholders: `"Laptop"`, `"Car"`, `"Apartment"`. Replace with your own categories. |
| `subtypes` | string | Sub-categories within a category. Example placeholders: `"Gaming Laptop"`, `"SUV"`, `"Studio Apartment"`. Customize as needed. |
| `attributes` | string | Properties of a resource the user may want to query or retrieve. Example placeholders: `"price"`, `"color"`, `"year"`. Replace with your own attributes. |
| `minMaxRange` | object | Represents numeric range filters for attributes like price, year, size, or rating. <br>**Properties:** <br>`min` (number) – minimum value <br>`max` (number) – maximum value. These are examples and should be adjusted to your domain. |

---

### Main Schema Object

- **Type:** `object`  
- **Description:** Represents a single resource query request. All field names and filters here are **examples and placeholders**.  

#### Properties:

| Field | Type | Description |
|-------|------|-------------|
| `type` | string (enum: `list`, `query`) | Determines if the request is a **list** of resources or a filtered **query**. Example values; can be customized. |
| `filters` | object | Filters to narrow down results by category, subtype, name, year, or numeric ranges. **All provided filters are examples** and should be customized. <br>**Properties:** <br>`category` – from `$defs.categories` <br>`subtype` – from `$defs.subtypes` <br>`name` – specific resource name <br>`year` – numeric attribute <br>`rangeFilters` – from `$defs.minMaxRange` <br>Supports additional custom filters via `additionalProperties`. |
| `features` | array of strings | List of attributes the user wants to retrieve for each resource. Uses keys defined in `$defs.attributes`. **All example attributes are placeholders.** |

#### Required Fields:

- `type`
- `filters`
- `features`

---

