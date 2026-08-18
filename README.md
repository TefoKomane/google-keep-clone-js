# Google Keep Clone

A Google Keep-inspired note-taking app built with HTML, CSS, and JavaScript. The project recreates the feel of a lightweight productivity app where users can create, organize, search, archive, and manage notes in a clean and responsive interface.

## Project Overview

This application was developed to mirror the core functionality and user experience of Google Keep in a simplified web-based format. It allows users to create notes with a title, text, color, and reminder status, then view them in a structured layout with navigation for different note categories.

The project demonstrates core web development skills, including DOM manipulation, event handling, local storage, responsive design, and user interface layout design. It is a front-end project that runs entirely in the browser without the need for a backend.

## Problem It Solves

Many users need a quick and simple way to capture notes, ideas, and reminders without the complexity of full-scale productivity platforms. This app provides a clean, intuitive interface for recording and organizing notes while using only lightweight client-side technologies.

## Features

- Create notes with a title and body text
- Choose different note colors for visual organization
- Add reminder timestamps to notes
- Search notes by title, content, or reminder text
- View notes in separate sections for Notes, Reminders, Archive, Labels, and Trash
- Edit existing notes through a modal dialog
- Archive notes and restore them later
- Move notes to trash and delete them permanently when needed
- Add and remove custom labels
- Persist data in browser localStorage so notes remain after refresh
- Responsive layout for desktop and mobile screens
- Google Keep-inspired styling, navigation, and color palette

## User Experience Goals

The app is designed to be:

- Simple and easy to use
- Visually clean and familiar to Google Keep users
- Fast and responsive
- Accessible through standard browser interactions
- Functional without external libraries or backend services

## Technologies Used

- HTML5 for structure and layout
- CSS3 for styling, layout, responsiveness, and visual polish
- JavaScript for dynamic UI behavior and logic
- Browser localStorage for data persistence

## Project Structure

- index.html: main app structure and layout
- style.css: all visual styling, layout rules, and responsive design
- script.js: note logic, event listeners, rendering functions, and localStorage logic
- Google_Keep_Logo.png: app logo used in the browser tab and branding
- icons/: folder containing SVG assets for the sidebar and action icons

## How to Run the App

1. Open the project folder in your code editor.
2. Start a local web server from the project root. For example:

   python -m http.server 8000

3. Open the following URL in your browser:

   http://localhost:8000

You may also open the HTML file directly in a browser, but running through a local server is recommended because it behaves more consistently and is closer to real web deployment conditions.

## App Usage

### Creating a Note

- Enter a title and/or note text in the composer box.
- Choose a color if desired.
- Optionally enable the reminder checkbox.
- Click Add note to save it.

### Editing a Note

- Click the Edit button on a note card.
- Update the title, text, or color.
- Save the changes to apply them.

### Archiving and Restoring Notes

- Use the Archive action to move a note into the archive view.
- Restore it later from the archive section when needed.

### Managing Trash

- Move notes into Trash when they are no longer needed.
- Delete notes permanently or restore them if they were accidentally trashed.

### Using Labels

- Go to the Labels view from the sidebar.
- Add custom labels and remove them as needed.
- Use this as a lightweight organization system for notes.

### Searching Notes

- Use the search box in the top bar to filter notes by title, content, or reminder details.

## Browser Storage

The app uses localStorage to save notes, archived notes, trash entries, and labels. This means the user data remains available after a page refresh without a backend database.

## Rubric Alignment

This project aligns with a typical front-end web development rubric by demonstrating:

- User interface design: a clean and functional layout inspired by Google Keep
- Interaction design: real user actions such as add, edit, archive, trash, search, and color selection
- Responsive web design: layouts that adapt for mobile screens
- JavaScript logic: event-driven programming and DOM updates
- Data persistence: browser localStorage for storing user content
- Code organization: clear separation between HTML structure, CSS styling, and JavaScript behavior

## Future Improvements

Possible enhancements for the project include:

- Drag-and-drop note organization
- More advanced reminder scheduling and date selection
- Label filtering and grouped note views
- Dark mode support
- Better accessibility improvements such as keyboard support and ARIA enhancements
- Optional backend storage for cloud syncing

## Conclusion

This project showcases how a simple but functional note-taking application can be built using foundational web technologies. It combines a polished user interface with practical features and demonstrates the core principles of front-end web development in an accessible and beginner-friendly way.
