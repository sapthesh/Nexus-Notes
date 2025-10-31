# Nexus Notes: Offline Bookmark & Note Manager

**Nexus Notes** is an advanced, offline-first, browser-based application for managing bookmarks and notes with a focus on privacy, speed, and a clean user experience. All your data is stored directly in your browser's local storage, ensuring it's always available, even without an internet connection, and never leaves your device.

---

## ✨ Key Features

-   **📴 Offline-First:** Works completely offline. All data is stored locally in your browser's `localStorage`. No internet connection is needed after the initial load.
-   **🔒 Privacy Focused:** Your data is yours. Nothing is ever sent to a server.
-   **📚 Unified Management:** Keep both rich-text notes and web bookmarks in one organized place.
-   **✍️ Rich Text Editor:** A powerful [Quill.js](https://quilljs.com/) editor for notes, supporting various formatting options like headers, lists, code blocks, links, and more.
-   **🏷️ Powerful Tagging:** Organize items with multiple tags for flexible categorization and quick filtering.
-   **🔍 Advanced Fuzzy Search:** An intelligent search that finds what you're looking for, even with typos, using the Levenshtein distance algorithm. Search by title, content, or tags.
-   **🎛️ Bulk Actions:** Efficiently manage multiple items at once. Select several items to delete them or add tags in a single action.
-   **📱 Responsive Design:** A clean, modern UI that works seamlessly across desktop, tablet, and mobile devices.
-   **🌓 Light & Dark Modes:** Automatically adapts to your system's theme and allows for manual switching.
-   **⇅ Sorting & Filtering:** Easily sort items by title, creation date, or last update. Filter your view to see all items, just bookmarks, just notes, or items with a specific tag.
-   **🌐 Automatic Favicon Fetching:** Bookmarks are automatically enhanced with their website's favicon for easy visual identification.

---

## 🛠️ Tech Stack

-   **Frontend:** [React](https://reactjs.org/) (with Hooks) & [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) for a utility-first styling workflow.
-   **Rich Text Editing:** [Quill.js](https://quilljs.com/)
-   **Data Storage:** Browser `localStorage` API.
-   **Icons:** Custom SVG icons.
-   **Build:** No build step required; runs directly in the browser using ES modules and CDN-hosted dependencies.

---

## 🚀 Getting Started

Since Nexus Notes is a fully client-side application, getting started is incredibly simple.

1.  **Download the Files:** Clone this repository or download the project files as a ZIP.
2.  **Open in Browser:** Open the `index.html` file in any modern web browser (like Chrome, Firefox, Safari, or Edge).

That's it! The application will be running locally. You can start adding notes and bookmarks immediately.

### Hosting

To host your own instance, simply deploy the project files to any static hosting service, such as:

-   [GitHub Pages](https://pages.github.com/)
-   [Netlify](https://www.netlify.com/)
-   [Vercel](https://vercel.com/)

---

## 📂 Project Structure

```
/
├── components/          # React components (Cards, Modals, Header, etc.)
│   ├── icons/           # SVG icon components
│   ├── BulkTagModal.tsx
│   ├── Header.tsx
│   ├── ItemCard.tsx
│   ├── ItemList.tsx
│   ├── ItemModal.tsx
│   ├── Notification.tsx
│   ├── Sidebar.tsx
│   ├── SortControl.tsx
│   └── ThemeToggle.tsx
├── hooks/               # Custom React hooks
│   ├── useLocalStorage.ts
│   └── useTheme.ts
├── App.tsx              # Main application component with core logic
├── index.html           # The entry point of the application
├── index.tsx            # Renders the React application
├── metadata.json        # Project metadata
├── types.ts             # TypeScript type definitions
└── readme.md            # You are here!
```

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features, bug fixes, or improvements, feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
