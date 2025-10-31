import { Item } from './types';

export const demoData: Item[] = [
  {
    id: 'demo-bookmark-1',
    type: 'bookmark',
    title: 'React Official Website',
    url: 'https://react.dev/',
    description: 'The official documentation for React, the library for web and native user interfaces.',
    tags: ['react', 'javascript', 'documentation', 'frontend'],
    createdAt: '2023-10-26T10:00:00Z',
    updatedAt: '2023-10-26T10:00:00Z',
  },
  {
    id: 'demo-note-1',
    type: 'note',
    title: 'Project Ideas Brainstorm',
    content: `
      <h2>Meeting Notes - Project Nexus</h2>
      <p>Here are the key takeaways from our brainstorm session:</p>
      <ul>
        <li><strong>Feature 1:</strong> Offline-first capability is a must.</li>
        <li><strong>Feature 2:</strong> Implement a robust tagging system.</li>
        <li><strong>Feature 3:</strong> Advanced search with typo tolerance.</li>
      </ul>
      <p>Next steps: Draft initial UI mockups.</p>
      <pre class="ql-syntax" spellcheck="false">function helloWorld() {\n  console.log("Hello, Nexus Notes!");\n}\n</pre>
    `,
    tags: ['project-nexus', 'ideas', 'meeting', 'development'],
    createdAt: '2023-10-25T14:30:00Z',
    updatedAt: '2023-10-26T11:00:00Z',
  },
  {
    id: 'demo-bookmark-2',
    type: 'bookmark',
    title: 'Tailwind CSS - Rapidly build modern websites',
    url: 'https://tailwindcss.com/',
    description: 'A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.',
    tags: ['css', 'frontend', 'design', 'framework'],
    createdAt: '2023-10-24T09:15:00Z',
    updatedAt: '2023-10-24T09:15:00Z',
  },
  {
    id: 'demo-bookmark-3',
    type: 'bookmark',
    title: 'Quill - Your powerful rich text editor',
    url: 'https://quilljs.com/',
    description: 'Quill is a modern WYSIWYG editor built for compatibility and extensibility.',
    tags: ['editor', 'javascript', 'library', 'rich-text'],
    createdAt: '2023-10-23T18:00:00Z',
    updatedAt: '2023-10-23T18:00:00Z',
  },
  {
    id: 'demo-note-2',
    type: 'note',
    title: 'Weekly Goals',
    content: `
      <h3>Goals for this week:</h3>
      <ol>
        <li>Finish the main feature implementation.</li>
        <li>Write comprehensive documentation.</li>
        <li>Prepare for the demo presentation.</li>
      </ol>
      <blockquote>"The best way to predict the future is to create it."</blockquote>
    `,
    tags: ['productivity', 'goals', 'planning'],
    createdAt: '2023-10-22T11:45:00Z',
    updatedAt: '2023-10-26T09:00:00Z',
  },
];
