# Handmade Art

Handmade Art is a full-stack product catalogue and management application for handmade artwork. Visitors can browse the collection, view individual product details, and start an enquiry through WhatsApp or email. An authenticated administrator can manage products and images, mark featured items, and use AI to draft product descriptions before reviewing and saving them.

## Live demo

No deployed frontend URL is committed in this repository. The checked-in local frontend configuration points to `http://localhost:5000/api`; see [Local setup](#local-setup) to run the application.

## Features

### Public experience

- Homepage with a hero section, contact call-to-action, and up to four featured products.
- Product catalogue and individual product-detail pages.
- About / “Our Story” page.
- Responsive navigation, including a mobile menu.
- WhatsApp enquiry links, including a product-specific pre-filled message on product pages.
- Email enquiry link in the footer.

### Admin experience

- Admin sign-in with JSON Web Token (JWT) authentication.
- Dashboard showing product and featured-product counts.
- Create, edit, and delete product records.
- Image validation (image MIME type and a 5 MB upload limit).
- Optional product-image replacement, with Cloudinary cleanup of the previous asset.
- Product deletion removes the associated Cloudinary asset before removing the database record.

### AI assistance

- Authenticated endpoint to generate a draft product description from product details.
- Hugging Face’s OpenAI-compatible router, with fallback attempts across Gemma, GPT-OSS, and Kimi models.
- The admin form puts the generated text into an editable textarea; it is not saved automatically.

## Tech stack

| Area | Technologies used |
| --- | --- |
| Frontend | Next.js 16, React 19, JavaScript, Tailwind CSS 4 |
| Backend | Node.js, Express 5, JavaScript |
| Data | MongoDB, Mongoose |
| Authentication | JWT (`jsonwebtoken`), `bcryptjs` |
| Uploads and media | Multer, Cloudinary |
| AI | Hugging Face Router through the OpenAI JavaScript client |
| Supporting backend packages | CORS, dotenv, Nodemon (development) |

## Architecture overview

```text
Browser / Next.js frontend
       |
       | HTTP requests (JSON or multipart/form-data)
       v
Express API
  |        |                         |
  |        |                         +--> Hugging Face Router --> description draft
  |        |
  |        +--> Cloudinary --> image URL + public ID
  |
  +--> MongoDB (products and admins)
```

The frontend reads its API base URL from `NEXT_PUBLIC_API_URL`. Express exposes public catalogue reads and protects product mutations, direct image uploads, and AI generation with a bearer JWT. Product records store the Cloudinary secure URL used by the UI and the Cloudinary public ID needed for later cleanup.

## Project structure

```text
Handmade-art/
├── backend/
│   ├── src/
│   │   ├── config/             # MongoDB and Cloudinary configuration
│   │   ├── controllers/        # auth, product, upload, and AI handlers
│   │   ├── middleware/         # JWT guard and Multer upload handling
│   │   ├── models/             # Admin and Product Mongoose models
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Cloudinary and AI integrations
│   │   └── server.js           # Express app and database startup
│   ├── package.json
│   └── .env                    # local-only; ignored by Git
└── frontend/
    ├── app/
    │   ├── about/              # About page
    │   ├── admin/              # login, dashboard, create/edit product pages
    │   ├── components/         # shared UI components
    │   ├── lib/                # API client and WhatsApp URL helper
    │   ├── products/           # catalogue and product detail pages
    │   ├── globals.css
    │   ├── layout.js
    │   └── page.js             # home page
    ├── public/main-image.jpeg
    ├── package.json
    └── .env                    # local-only; ignored by Git
```

## Product data model

The `Product` Mongoose schema contains the following fields and enables automatic `createdAt` and `updatedAt` timestamps.

| Field | Type | Constraints / purpose |
| --- | --- | --- |
| `name` | String | Required; trimmed |
| `description` | String | Required; trimmed |
| `price` | Number | Required; minimum `0` |
| `image` | String | Required; Cloudinary secure URL displayed by the frontend |
| `imagePublicId` | String | Required; Cloudinary identifier used when replacing or deleting an image |
| `category` | String | Required; trimmed |
| `isFeatured` | Boolean | Defaults to `false`; controls the homepage’s featured list |
| `createdAt` / `updatedAt` | Date | Added by Mongoose timestamps |

An `Admin` model also exists with required `name`, unique lowercase `email`, and `password` fields. The login controller compares the submitted password against the stored bcrypt hash.

## Authentication flow

```text
Admin login form
  -> POST /api/auth/login (email, password)
  -> bcrypt compares password with Admin.password
  -> server issues a JWT valid for 7 days
  -> frontend stores token as localStorage["adminToken"]
  -> protected requests send Authorization: Bearer <token>
  -> middleware verifies JWT_SECRET and sets req.admin
```

The frontend redirects a visitor without `adminToken` from admin dashboard/create/edit flows to `/admin/login`. At the API layer, `POST`, `PUT`, and `DELETE` product routes, `POST /api/upload/product-image`, and `POST /api/ai/generate-description` require a valid JWT. Catalogue reads remain public. There is no active public admin-registration endpoint; the create-admin controller and route are commented out.

## Image upload flow

1. The admin submits a product create/update form as `multipart/form-data` using the `image` field.
2. Multer validates that the file MIME type starts with `image/`, limits it to 5 MB, and writes it to a temporary `uploads/` directory using **disk storage**.
3. The controller uploads that temporary file to Cloudinary’s `handmade-art/products` folder.
4. Cloudinary returns a secure URL and public ID. These become the product’s `image` and `imagePublicId` fields in MongoDB.
5. The temporary local file is removed after upload. When an image is replaced, the updated product is saved before the prior Cloudinary public ID is destroyed. Deleting a product destroys its Cloudinary image first, then deletes the MongoDB record.

The API also implements an authenticated `POST /api/upload/product-image` endpoint for direct image upload. The current frontend product forms use the product create/update endpoints instead.

## AI description generation flow

1. In the create or edit form, the admin enters a product name and selects **Generate with AI**.
2. The frontend sends the name, category, material, art style, and key details to the protected AI endpoint. The current forms send an empty material and key-details value and use `Indian folk art` as the art style.
3. The backend builds a constrained 60–90 word catalogue-description prompt and calls the Hugging Face Router. It tries Gemma first, then GPT-OSS, then Kimi if a provider fails.
4. The returned draft fills the editable description field. The admin reviews or changes it, then explicitly saves the product through the normal product endpoint.

## API documentation

The endpoints below are implemented by the Express server. Product create and update routes accept `multipart/form-data`; the image file field is named `image`.

| Method | Route | Purpose | Authentication |
| --- | --- | --- | --- |
| `GET` | `/` | Basic API-running response | No |
| `GET` | `/api/health` | Health response | No |
| `POST` | `/api/auth/login` | Authenticate an existing admin and return a JWT | No |
| `GET` | `/api/products` | Return all products, newest first | No |
| `GET` | `/api/products/:id` | Return one product by MongoDB ID | No |
| `POST` | `/api/products` | Create a product and upload its required image | Yes |
| `PUT` | `/api/products/:id` | Update product fields and optionally replace its image | Yes |
| `DELETE` | `/api/products/:id` | Delete a product and its associated Cloudinary image | Yes |
| `POST` | `/api/upload/product-image` | Upload one product image to Cloudinary | Yes |
| `POST` | `/api/ai/generate-description` | Generate a product-description draft | Yes |

Protected endpoints expect `Authorization: Bearer <JWT>`. The server’s error middleware returns JSON for upload errors, including the 5 MB limit; controllers also return JSON status/error responses for validation and service failures.

## Local setup

### Prerequisites

- Node.js and npm
- A MongoDB instance
- A Cloudinary account/configuration
- A Hugging Face token with access appropriate for the configured router models
- An existing admin document with a bcrypt-hashed password (no registration endpoint is enabled)

### 1. Configure and start the backend

```bash
cd backend
npm install
```

Create `backend/.env` using the names shown in [Environment variables](#environment-variables), then run:

```bash
npm run dev
```

The default backend port is `5000`, so the local API base is `http://localhost:5000/api`.

### 2. Configure and start the frontend

In a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` with `NEXT_PUBLIC_API_URL=http://localhost:5000/api` and the other public contact variables, then run:

```bash
npm run dev
```

Open `http://localhost:3000` in a browser. Production-oriented scripts are `npm start` in `backend` and `npm run build` followed by `npm start` in `frontend`.

## Environment variables

Create local `.env` files only; they are ignored by Git. Use your own values and do not commit credentials.

### `backend/.env`

```dotenv
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=<long-random-secret>
HF_TOKEN=hf_<your-token>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

### `frontend/.env`

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hello%20from%20Handmade%20Art
NEXT_PUBLIC_CONTACT_EMAIL=you@example.com
```

`NEXT_PUBLIC_*` values are exposed to the browser by Next.js. Keep only public configuration in them. The WhatsApp helper strips non-digits from the phone number and URL-encodes the message itself.

## Deployment

No deployed public URL, Vercel configuration, Render configuration, or database-hosting configuration is tracked in the repository. The backend upload middleware does include a comment addressing temporary-directory creation in Render containers, but that is not sufficient to verify a live deployment. Configure the environment variables above in the chosen hosting environments and set `NEXT_PUBLIC_API_URL` to the deployed backend’s `/api` base URL when deploying.

## Project status

### Completed

- Public product browsing, product details, responsive navigation, WhatsApp enquiries, and email contact.
- JWT-backed admin login and protected product-management operations.
- MongoDB/Mongoose product persistence with create, read, update, and delete operations.
- Cloudinary image upload, replacement, and deletion cleanup.
- AI-assisted description drafting with manual review before persistence.
- API validation and JSON error handling for common authentication, upload, and controller failures.

### Planned / future

- Payment-gateway integration. No payment flow or payment API is implemented in this repository.

## Security considerations

- Secrets are read from environment variables and the repository ignores `.env` files.
- Password verification uses `bcryptjs`; login responses do not return the password.
- JWTs are signed with `JWT_SECRET`, expire after seven days, and protect mutation/upload/AI API endpoints.
- Uploads are restricted to image MIME types and 5 MB. Successful upload flows remove their temporary files; the update and direct-upload controllers also attempt cleanup when their controller work fails.
- The frontend currently stores the JWT in `localStorage`. For a higher-security production deployment, consider an HttpOnly, Secure, SameSite cookie strategy and CSRF protections.
- CORS is currently enabled with the package default (`app.use(cors())`), rather than an explicit production-origin allowlist.
- The code validates MIME type but does not perform deeper file-content inspection; production hardening could add malware scanning or content validation.

## Future improvements

- Add filtering, search, pagination, and category navigation for larger catalogues.
- Configure a restrictive CORS allowlist, security headers, rate limits, and structured logging.
- Implement the planned payment flow only after product, order, and payment requirements are defined.

## Author

**Kareena2070** — repository author information is taken from the latest Git commit.
