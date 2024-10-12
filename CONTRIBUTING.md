# Contributing to AetherLink

Thank you for your interest in contributing to AetherLink! This document provides guidelines for contributing to the project.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/aetherlink.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit with meaningful messages
7. Push to your fork
8. Create a Pull Request

## Development Setup

```bash
# Install all dependencies
npm run install:all

# Run tests
npm test

# Start local development
npm run dev
```

## Project Structure

```
aetherlink/
├── contracts/          # Solidity smart contracts
│   ├── contracts/     # Contract source files
│   ├── test/         # Contract tests
│   └── scripts/      # Deployment scripts
├── circuits/          # Circom ZK circuits
│   └── src/          # Circuit source files
├── frontend/          # Next.js frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/      # Next.js pages
│   │   └── utils/      # Utility functions
├── subgraph/          # The Graph indexer
│   ├── src/          # Mapping functions
│   └── schema.graphql # GraphQL schema
└── docs/             # Documentation
```

## Coding Standards

### Solidity Contracts

- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use explicit visibility modifiers
- Add NatSpec comments for all public functions
- Keep functions focused and under 50 lines
- Write comprehensive tests for all contract functions

Example:
```solidity
/**
 * @notice Creates a new edge in the graph
 * @param nodeA First node address
 * @param nodeB Second node address
 * @param weight Edge weight
 * @return edgeId Unique identifier for the edge
 */
function createEdge(
    address nodeA,
    address nodeB,
    uint256 weight
) external returns (bytes32 edgeId) {
    // Implementation
}
```

### TypeScript/JavaScript

- Use TypeScript for type safety
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use meaningful variable and function names
- Keep functions pure when possible
- Add JSDoc comments for complex functions

Example:
```typescript
/**
 * Generates a zero-knowledge proof for a relationship path
 * @param startNode - Starting node address
 * @param endNode - Ending node address
 * @param pathNodes - Array of intermediate nodes
 * @returns Proof object with serialized proof and public inputs
 */
async function generatePathProof(
  startNode: string,
  endNode: string,
  pathNodes: string[]
): Promise<ProofObject> {
  // Implementation
}
```

### Circom Circuits

- Use clear signal names
- Document constraints with comments
- Keep circuits modular
- Test with various input combinations

## Testing Requirements

### Smart Contracts

All contract changes must include tests:

```javascript
describe("Feature Name", function () {
  it("should do something correctly", async function () {
    // Test implementation
  });
  
  it("should reject invalid inputs", async function () {
    await expect(contract.function()).to.be.revertedWith("Error message");
  });
});
```

### Frontend

- Write unit tests for utility functions
- Test component rendering
- Test user interactions

### Test Coverage

- Maintain minimum 80% code coverage
- Test edge cases and error conditions
- Include integration tests

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(contracts): add batch reputation update function

Implement batchUpdateReputation to efficiently update multiple
node reputations in a single transaction, reducing gas costs.

Closes #123
```

```
fix(frontend): resolve wallet connection issue on mobile

Fix MetaMask connection not working on mobile devices by
properly handling the mobile deep link flow.
```

## Pull Request Process

1. **Before submitting:**
   - Ensure all tests pass
   - Update documentation if needed
   - Run linter and fix any issues
   - Rebase on latest main branch

2. **PR Description:**
   - Describe what changes you made and why
   - Reference any related issues
   - Include screenshots for UI changes
   - List any breaking changes

3. **Review Process:**
   - At least one maintainer approval required
   - Address all review comments
   - Keep PR focused on a single feature/fix
   - Respond to feedback within 48 hours

4. **After Approval:**
   - Squash commits if requested
   - Maintainer will merge the PR

## Areas for Contribution

### High Priority

- [ ] Implement recursive ZK proof composition
- [ ] Add Lens Protocol integration
- [ ] Optimize gas costs in contracts
- [ ] Improve frontend UX/UI
- [ ] Add comprehensive E2E tests

### Good First Issues

- [ ] Add more test cases
- [ ] Improve documentation
- [ ] Fix TypeScript type errors
- [ ] Add input validation
- [ ] Improve error messages

### Documentation

- [ ] Add video tutorials
- [ ] Create architecture diagrams
- [ ] Write integration guides
- [ ] Translate documentation

## Security

### Reporting Vulnerabilities

**DO NOT** create public issues for security vulnerabilities.

Instead:
1. Email security@aetherlink.io
2. Include detailed description
3. Provide steps to reproduce
4. Allow 90 days for fix before disclosure

### Security Best Practices

- Never commit private keys or secrets
- Validate all user inputs
- Use SafeMath or Solidity 0.8+ for arithmetic
- Implement access controls properly
- Follow principle of least privilege

## Community

- **Discord:** [Join our server](https://discord.gg/aetherlink)
- **Twitter:** [@AetherLinkDAO](https://twitter.com/aetherlinkdao)
- **Forum:** [forum.aetherlink.io](https://forum.aetherlink.io)

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Acknowledged in release notes
- Eligible for governance tokens (when launched)
- Featured in community highlights

## Questions?

Feel free to:
- Open a Discussion on GitHub
- Ask in Discord #dev-chat
- Email dev@aetherlink.io

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AetherLink! 🚀

