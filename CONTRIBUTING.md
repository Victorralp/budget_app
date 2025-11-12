# Contributing to E-Commerce Store

Thank you for your interest in contributing to this e-commerce store project! This guide will help you get started.

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/ecommerce-store.git
   cd ecommerce-store
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables (see SETUP.md)
5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
.
├── app/              # Next.js app router pages
├── components/       # React components
├── contexts/         # React Context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
├── types/           # TypeScript definitions
└── public/          # Static assets
```

## Code Style

- **TypeScript:** All new code should be written in TypeScript
- **Formatting:** Use the existing code style and conventions
- **Components:** Use functional components with React hooks
- **Naming:**
  - Components: PascalCase (e.g., `ProductCard.tsx`)
  - Hooks: camelCase with 'use' prefix (e.g., `useCart.ts`)
  - Types: PascalCase (e.g., `Product`, `CartItem`)
  - Files: Match the component/export name

## Commit Guidelines

Use clear and descriptive commit messages:

```
feat: Add product search functionality
fix: Resolve cart total calculation issue
docs: Update README with deployment instructions
style: Format checkout form components
refactor: Simplify cart state management
test: Add tests for product filtering
```

## Pull Request Process

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Build and test locally:
   ```bash
   npm run build
   npm run lint
   ```
4. Commit your changes with clear messages
5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a Pull Request with:
   - Clear title and description
   - Screenshots for UI changes
   - List of changes made
   - Any breaking changes

## Testing

- Test all changes locally before submitting
- Verify responsive design on different screen sizes
- Check for TypeScript errors: `npm run build`
- Run linting: `npm run lint`

## Areas for Contribution

### High Priority
- [ ] User authentication UI (login/signup forms)
- [ ] Product search and filtering
- [ ] Payment integration (Stripe)
- [ ] Order history page
- [ ] Product detail page

### Features
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Admin dashboard
- [ ] Product categories
- [ ] Advanced filtering (price range, ratings)
- [ ] Related products section

### Improvements
- [ ] Loading states and skeletons
- [ ] Error boundaries
- [ ] Toast notifications system
- [ ] Image optimization
- [ ] SEO optimization
- [ ] Performance improvements
- [ ] Accessibility improvements

### Documentation
- [ ] API documentation
- [ ] Component documentation
- [ ] Testing guide
- [ ] Deployment guide

## Code Review Process

All submissions require code review. The review will check for:

- Code quality and style
- TypeScript type safety
- Performance considerations
- Security best practices
- Accessibility
- Documentation

## Questions?

If you have questions or need help, please:
- Open an issue with the "question" label
- Check existing issues and documentation
- Reach out to the maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).
