# Memact Contracts

Contracts defines the validation shapes used across the Memact protocols.

## What Contracts Does

This repository contains the validator functions for schemas. It does not perform network or database operations. It only checks if data structures conform to the expected format.

Contracts validates:
- User identity addresses.
- CAP requests and response packets.
- CCP suggestions (proposals).
- Provider capability documents.
- Database memory records.

## Development

To install and run tests:
```powershell
npm install
npm test
```

## License

Contracts is open source under the Apache 2.0 license.
