# What's New

## 📝 Description

_Provide a concise summary of the changes. Link any related issues (e.g., Fixes #123)._

---

## 🛠 Type of Change

- [ ] **Feature**: New API endpoint or business logic.
- [ ] **Fix**: Bug fix in logic, database query, or middleware.
- [ ] **Refactor**: Code cleanup or SOLID improvements (no functional changes).
- [ ] **Database**: GORM migrations or schema updates.
- [ ] **Security**: Updates to JWT, RBAC, or sensitive data handling.
- [ ] **Performance**: Optimization of queries or resource usage.

## 🧪 Technical Checklist

- [ ] **SOLID Compliance**: Interfaces are used for Dependency Injection.
- [ ] **Database**: Migrations are verified and queries are optimized (checked for N+1).
- [ ] **Error Handling**: Follows the centralized error response pattern.
- [ ] **Swagger**: `swag` comments updated and `docs` re-generated.
- [ ] **Security**: RBAC middleware correctly protects new/modified routes.
- [ ] **Environment**: New environment variables added to `.env.example` (if any).

## 🚦 Test Coverage

- [ ] **Unit Tests**: Business logic tested with mocks.
- [ ] **Integration Tests**: End-to-end flow verified from Gin route to DB.
- [ ] **Manual Testing**: Verified via Postman/Swagger with valid/invalid JWTs.

## 📊 Evidence (Optional)

_Paste Swagger screenshots, Postman results, or relevant log snippets here._
