# Express.js Product API

## Setup

1. Clone the repo and navigate into it:
```bash
git clone <your-repo-url>
cd <your-repo-folder>
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example` and add your settings.

4. Start the server:

```bash
node server.js
```

Server runs on `http://localhost:3000`

---

## Environment Variables

Use `.env.example` as a template:

```
PORT=3000
AUTH_TOKEN=secret123
```

---

## API Endpoints

### Public

* `GET /`
  Welcome message.

* `GET /api/products`
  List all products. Supports filtering by category (`?category=`), pagination (`?page=`, `?limit=`), and search by name (`?search=`).

* `GET /api/products/:id`
  Get a product by ID.

* `GET /api/statistics`
  Get product counts by category.

* `GET /api/search?name=term`
  Search products by name.

---

### Protected (require x-api-key` header)

* POST /api/products
  Create a new product.

* PUT /api/products/:id
  Update a product.

* DELETE /api/products/:id
  Delete a product.


## Authentication

For protected routes, include this header:


x-api-key: secret123

## Testing

Use Postman or curl to test the API endpoints.


## Errors

* 400: Bad request
* 401: Unauthorized
* 404: Not found
* 500: Server error


## License

For educational use only.
