# Advanced Tab Manager

A powerful Chrome extension for advanced tab management with grouping, search, and session management features.

## Features

### Core Tab Management
- **Tab Overview**: View all open tabs across all windows
- **Quick Search**: Search tabs by title or URL
- **Tab Switching**: Click any tab to switch to it instantly
- **Tab Closing**: Close individual tabs with one click

### Advanced Organization
- **Filter Options**: 
  - View all tabs
  - Show only current window tabs
  - Show duplicate tabs only
- **Smart Sorting**: Sort tabs by title, URL, domain, or recent usage
- **Duplicate Detection**: Automatically identify and highlight duplicate tabs
- **Bulk Operations**: Select multiple tabs for batch operations

### Tab Grouping
- **Group by Domain**: Automatically group tabs from the same website
- **Custom Groups**: Create custom tab groups from selected tabs
- **Visual Organization**: Color-coded groups for easy identification
- **Ungroup Tabs**: Remove individual tabs from groups or ungroup all tabs at once
- **Group Indicators**: Visual markers show which tabs are grouped

### Session Management
- **Save Sessions**: Save current browser state with all tabs and windows
- **Restore Sessions**: Restore previously saved sessions
- **Session History**: Keep track of up to 10 recent sessions
- **Cross-Window Support**: Save and restore multiple windows

### User Experience
- **Keyboard Shortcuts**:
  - `Ctrl+Shift+T` (or `Cmd+Shift+T` on Mac): Open Advanced Tab Manager
  - `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac): Close duplicate tabs
  - `Ctrl+Shift+S` (or `Cmd+Shift+S` on Mac): Save current session
- **Modern UI**: Clean, responsive interface with smooth animations
- **Real-time Updates**: Live tab count and window statistics
- **Visual Indicators**: Active tabs, duplicates, and selections clearly marked

## Installation

### From Source (Development)
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The Advanced Tab Manager icon will appear in your toolbar

### Icon Setup (Required for Development)
The extension requires icon files. You can:
1. Use the provided `icons/icon.svg` as a template
2. Convert it to PNG format in sizes: 16x16, 32x32, 48x48, and 128x128
3. Save them as `icon16.png`, `icon32.png`, `icon48.png`, and `icon128.png` in the `icons/` directory

You can use online SVG to PNG converters or tools like:
- GIMP
- Inkscape
- Online converters (svg2png.com, etc.)

## Usage

1. **Opening the Extension**: Click the extension icon or use `Ctrl+Shift+T`
2. **Searching Tabs**: Type in the search box to filter tabs by title or URL
3. **Filtering**: Use filter buttons to show all tabs, current window, or duplicates
4. **Sorting**: Use the dropdown to sort tabs by different criteria
5. **Selecting Tabs**: Check boxes next to tabs for bulk operations
6. **Managing Sessions**: Click "Save Session" to save current state, "Restore Session" to view and restore saved sessions

## Permissions

The extension requires the following permissions:
- `tabs`: To access and manage browser tabs
- `storage`: To save sessions and settings
- `activeTab`: To switch to selected tabs
- `tabGroups`: To create and manage tab groups

## Development

### File Structure
```
├── manifest.json          # Extension configuration
├── popup.html             # Main popup interface
├── popup.css              # Styling for the popup
├── popup.js               # Main popup functionality
├── background.js          # Background service worker
├── icons/                 # Extension icons
│   ├── icon.svg          # Source SVG icon
│   ├── icon16.png        # 16x16 icon (required)
│   ├── icon32.png        # 32x32 icon (required)
│   ├── icon48.png        # 48x48 icon (required)
│   └── icon128.png       # 128x128 icon (required)
└── README.md             # This file
```

### Key Components
- **TabManager Class** (background.js): Handles background operations and keyboard shortcuts
- **AdvancedTabManager Class** (popup.js): Main popup functionality and UI management
- **Responsive CSS**: Modern styling with support for different screen sizes

## Future Enhancements

Potential features for future versions:
- Tab productivity analytics
- Custom themes and appearance options
- Advanced search with regex support
- Tab bookmarking and favorites
- Export/import sessions
- Tab memory usage monitoring
- Automatic tab management rules
- Integration with cloud storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source. Feel free to use, modify, and distribute according to your needs.

## Support

For issues, feature requests, or questions, please create an issue in the repository or contact the development team.
