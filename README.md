# ING Employee Management System

A simple web app to manage employees at ING Bank. You can add, edit, delete, and search for employees. The app supports English and Turkish languages.

## What You Can Do

- ✅ **Add, Edit, Delete**: Create and manage employee records
- ✅ **Two Views**: See employees in a table or list
- ✅ **Search**: Find employees quickly
- ✅ **Pages**: Split data into pages for easy viewing
- ✅ **Mobile Ready**: Works on phones and computers
- ✅ **Safe Delete**: Ask before deleting anything

## Technology Used

- **Web Framework**: LitElement
- **Data Storage**: Redux Toolkit
- **Languages**: English and Turkish support
- **Testing**: Automated tests
- **Code Tools**: ESLint, Prettier

## How to Start

### What You Need

- Node.js 16 or newer
- npm 8 or newer

### Setup

1. Download the code:
```bash
git clone <repository-url>
cd ing_project
```

2. Install packages:
```bash
npm install
```

3. Start the app:
```bash
npm run serve
```

4. Open your browser and go to `http://localhost:8000`

## Development

### Main Commands

```bash
npm run serve              # Start the app
npm test                   # Run tests
npm run i18n:extract       # Get text for translation
npm run i18n:build         # Build translations
```

## Testing

The app has many tests to make sure everything works correctly. **Test Coverage: 92.02%**

Run tests with:

```bash
npm test
```
