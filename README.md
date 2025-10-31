# Nexus Notes: Your Private, Offline-First, Feature-Rich Notebook

<img src="https://img.shields.io/github/repo-size/sapthesh/Nexus-Notes?style=for-the-badge&logo=github&color=ff69b4&logoColor=white" alt="Repo Size"> <img src="https://img.shields.io/github/last-commit/sapthesh/Nexus-Notes?style=for-the-badge&logo=github&color=f4d03f&logoColor=white" alt="Last Commit"> 
<a href="https://hits.sh/github.com/sapthesh/Nexus-Notes/"><img alt="Hits" src="https://hits.sh/github.com/sapthesh/Nexus-Notes.svg?style=for-the-badge"/></a>
<a href="https://hits.sh/github.com/sapthesh/Nexus-Notes/"><img alt="Hits" src="https://hits.sh/github.com/sapthesh/Nexus-Notes.svg?view=today-total&style=for-the-badge&color=fe7d37"/></a>
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-0.1-blue.svg?style=for-the-badge)]()

**Nexus Notes** is a sophisticated, browser-based, offline-first application for managing bookmarks and notes. It is designed with privacy, performance, and a rich user experience at its core. All data is stored exclusively in your browser's local storage, ensuring it is always private, instantly accessible without an internet connection, and entirely under your control.

---

## ✨ Core Philosophy & Features

Nexus Notes is built on three pillars: absolute privacy, offline-first reliability, and powerful, intuitive features.

#### 🔒 100% Offline & Private
-   **Local-First Storage:** All data—notes, bookmarks, tags—is stored directly in your browser's `localStorage`. Nothing is ever transmitted to a server.
-   **Always Available:** Access and manage your information anytime, anywhere, with or without an internet connection.
-   **You Own Your Data:** Your information never leaves your device.

#### ✍️ Advanced Note-Taking & Organization
-   **Powerful Rich Text Editor:** The integrated [Quill.js](https://quilljs.com/) editor supports a full range of formatting: headers, lists, bold, italics, links, images, code blocks, blockquotes, and more.
-   **Internal Note Linking:** Create your own personal wiki. Seamlessly link notes to each other directly from the editor to build a connected web of knowledge.
-   **Auto-Saving Drafts:** Never lose your train of thought. Unsaved changes to notes are automatically persisted as a draft and restored the next time you open them.
-   **Flexible Tagging:** Organize items with multiple tags. The sidebar allows for quick filtering by any tag, and the search function understands tags.
-   **Custom Views & Sorting:** Instantly filter your view to see all items, just notes, or just bookmarks. Sort your content by creation date, last update time, or title (A-Z, Z-A).

#### 🔍 Intelligent Search & Management
-   **Advanced Fuzzy Search:** Find what you need instantly, even with typos. The search leverages the Levenshtein distance algorithm to intelligently match titles, content, and tags, highlighting your query in the results.
-   **Efficient Bulk Actions:** An intuitive selection mode allows you to manage multiple items at once. Select several items to add tags or delete them in a single action.
-   **Smart Bookmark Handling:** Bookmarks are automatically enhanced with their website's favicon for quick visual recognition, along with quick-action buttons to copy the URL or open it in a new tab.

#### 🎨 Deep Personalization
-   **Customizable Themes:** Choose from a clean **Light** theme, an eye-friendly **Dark** theme, or a high-visibility **High-Contrast** mode for accessibility.
-   **Accent Colors:** Personalize the UI by choosing from a palette of 20+ accent colors to match your style.

#### 💾 Complete Data Control
-   **Import & Export:** Easily back up your entire database to a portable JSON file or restore it at any time. Your data is never locked in.
-   **Demo Data:** Load a set of sample items to explore all of the app's features right away.
-   **Danger Zone:** For a fresh start, you have the power to permanently delete all data in a single click.

---

## 🛠️ Technical Deep Dive & Stack

Nexus Notes is built with modern web technologies, carefully chosen to create a robust, zero-dependency client-side application.

-   **Frontend Framework:** **[React](https://reactjs.org/) (v19) with Hooks** and **[TypeScript](https://www.typescriptlang.org/)** for a modern, type-safe, and component-based architecture.
-   **Styling:** **[Tailwind CSS](https://tailwindcss.com/)** provides a utility-first framework for rapid, responsive, and consistent UI development. Themes are managed via CSS variables for instant switching without a page reload.
-   **Rich Text Editing:** **[Quill.js](https://quilljs.com/)** is used for its powerful, extensible, and reliable rich text editing capabilities.
-   **Data Storage:** The browser's **`localStorage` API** is used as the database, making the application inherently offline and private.
-   **Search Algorithm:** Fuzzy search is implemented using a custom **Levenshtein distance** function, which calculates the difference between two strings to provide typo-tolerant search results.
-   **No Build Step:** The application runs directly in the browser using **ES Modules**, an `importmap` for dependency management, and CDN-hosted libraries. This simplifies setup and development—there is no need for Node.js, npm, or a bundler like Webpack.

---

## 🚀 Getting Started

Getting started with Nexus Notes is incredibly simple, as there is no installation or build process required.

1.  **Download the Files:** Clone this repository or download the project files as a ZIP.
2.  **Open in Browser:** Open the `index.html` file in any modern web browser (e.g., Chrome, Firefox, Safari, Edge).

That's it! The application is now running locally. You can begin adding notes and bookmarks immediately.

### Hosting Your Own Instance
To host your own version, simply deploy the project files to any static hosting service, such as:
-   [GitHub Pages](https://pages.github.com/)
-   [Netlify](https://www.netlify.com/)
-   [Vercel](https://vercel.com/)
-   [Cloudflare Pages](https://pages.cloudflare.com/)

---

## 📂 Project Structure

```
/
├── components/          # React components
│   ├── icons/           # SVG icon components
│   ├── BulkTagModal.tsx
│   ├── ConfirmationModal.tsx
│   ├── Header.tsx
│   ├── ItemCard.tsx
│   ├── ItemList.tsx
│   ├── ItemModal.tsx
│   ├── LinkNoteModal.tsx
│   ├── Notification.tsx
│   ├── SettingsModal.tsx
│   ├── Sidebar.tsx
│   ├── SortControl.tsx
│   └── ThemeToggle.tsx
├── hooks/               # Custom React hooks
│   ├── useLocalStorage.ts
│   └── useTheme.ts
├── App.tsx              # Main application component with core logic and state management
├── demoData.ts          # Sample data for the application
├── index.html           # The HTML entry point with Tailwind config and theme loader
├── index.tsx            # Renders the React application into the DOM
├── metadata.json        # Project metadata
├── types.ts             # TypeScript type definitions for all data structures
└── readme.md            # You are here!
```

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features, bug fixes, or performance improvements, please feel free to open an issue to discuss it or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.
