# 🚀 Prisma-Cosmo

A powerful tool that automatically generates SDL-first GraphQL types and resolvers from your Prisma schema.

## 🌟 Features

- Generates GraphQL SDL types from Prisma models
- Creates basic CRUD resolvers automatically
- Supports both single and multiple Prisma schema files
- Generates TypeScript types for better type safety
- Creates DataLoaders for optimal query performance
- AWS AppSync compatible out of the box

## 📦 Installation

```bash
# Using bun (recommended)
bun add prisma-cosmo

# Using npm
npm install prisma-cosmo

# Using yarn
yarn add prisma-cosmo
```

## 🛠️ Usage

### Basic Usage

1. Place your Prisma schema(s) in the `prisma` folder:

   - For a single schema: `prisma/schema.prisma`
   - For multiple schemas: `prisma/schema/*.prisma`

2. Run Cosmo:

```bash
bun run cosmo
```

3. Cosmo will generate:
   - GraphQL SDL types
   - Basic CRUD resolvers
   - TypeScript types
   - DataLoaders for performance optimization

The generated code will be in the `prisma/generated` directory.

### Schema Organization

You can organize your Prisma schema in two ways:

1. **Single Schema File**:

   - Place your schema in `prisma/schema.prisma`

2. **Multiple Schema Files**:
   - Place your schemas in `prisma/schema/` directory
   - Example structure:
     ```
     prisma/
     ├── schema/
     │   ├── auth.prisma
     │   ├── users.prisma
     │   └── products.prisma
     ```
     Cosmo will automatically merge these files when needed.

### Ignoring Models

To exclude specific models from generation, add the `/// cosmo-ignore` comment above the model:

```prisma
/// cosmo-ignore
model TemporaryData {
  id Int @id
  data String
}
```

## 📚 Generated Structure

```
prisma/
└── generated/
    ├── models/
    │   └── [model]/
    │       ├── types.ts
    │       ├── resolvers.ts
    │       └── dataLoaders.ts
    └── schema.graphql
```

## 🔧 Configuration

No additional configuration needed! Cosmo follows Prisma's schema conventions and automatically generates appropriate GraphQL types and resolvers.

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📝 License

MIT

## 💪 Support

If you find any bugs or have feature requests, please create an issue on our GitHub repository.

For direct support:

- Email: dsaldarriaga@prevalentware.com
- GitHub Issues: [Create an issue](https://github.com/prevalentware/prisma-cosmo/issues)

## 🏢 About

Developed and maintained by [prevalentWare](https://prevalentware.com/)
