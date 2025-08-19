# ReadmeAI Custom Ignore File
# gitignore-style patterns to exclude files from README analysis

# Ignore development and build artifacts
*.cache
*.tmp
build/
dist/

# Ignore documentation generation
site/
docs/_build/

# Ignore test files
test_main.py
example_config.json

# Ignore directories
demo/
examples/

# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

#prisma
/prisma/migrations

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

