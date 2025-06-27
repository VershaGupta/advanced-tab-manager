# Advanced Tab Manager - Installation & Usage Guide

## 🚀 Quick Installation

### Method 1: Load as Developer Extension (Recommended for Testing)

1. **Download the Extension**
   - Clone or download this repository to your computer
   - Extract the files if downloaded as ZIP

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or go to Chrome Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked" button
   - Select the folder containing the extension files
   - The Advanced Tab Manager should now appear in your extensions list

5. **Pin the Extension (Optional)**
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Advanced Tab Manager" and click the pin icon
   - The extension icon will now be visible in your toolbar

## ✅ Verify Installation

After installation, you should see:
- ✅ Advanced Tab Manager icon in your Chrome toolbar
- ✅ No error messages in the Extensions page
- ✅ Extension shows as "Enabled"

## 🎯 First Use

1. **Open the Extension**
   - Click the Advanced Tab Manager icon in your toolbar
   - Or use keyboard shortcut: `Ctrl+Shift+T` (Windows/Linux) or `Cmd+Shift+T` (Mac)

2. **Test Basic Features**
   - You should see all your open tabs listed
   - Try searching for a tab using the search box
   - Click on a tab to switch to it

## 🔧 Troubleshooting

### Extension Not Loading
- **Check file structure**: Ensure `manifest.json` is in the root folder
- **Check permissions**: Make sure Chrome has permission to access the folder
- **Reload extension**: Go to `chrome://extensions/` and click the reload button

### Extension Icon Not Showing
- **Check if enabled**: Go to `chrome://extensions/` and ensure it's enabled
- **Pin the extension**: Click the puzzle piece icon and pin Advanced Tab Manager
- **Restart Chrome**: Sometimes a restart helps

### Features Not Working
- **Check console**: Open Developer Tools (F12) and check for JavaScript errors
- **Verify permissions**: The extension needs tabs, storage, and tabGroups permissions
- **Test with simple tabs**: Try with basic web pages first

### Common Issues

| Issue | Solution |
|-------|----------|
| "Extensions" page shows errors | Check that all files are present and manifest.json is valid |
| Keyboard shortcuts not working | Check if shortcuts conflict with other extensions |
| Tabs not grouping | Ensure you have Chrome 88+ for tab groups support |
| Sessions not saving | Check if storage permission is granted |

## 🎮 Usage Guide

### Basic Operations

**Opening the Extension:**
- Click toolbar icon or use `Ctrl+Shift+T` / `Cmd+Shift+T`

**Searching Tabs:**
- Type in the search box to filter tabs by title or URL
- Use `Ctrl+F` / `Cmd+F` to focus the search box

**Switching Tabs:**
- Click any tab in the list to switch to it
- Extension will close automatically after switching

**Closing Tabs:**
- Click the "×" button next to any tab
- Or select multiple tabs and use "Close Selected"

### Advanced Features

**Filtering:**
- **All**: Show all tabs across all windows
- **Current Window**: Show only tabs from the active window
- **Duplicates**: Show only tabs with duplicate URLs

**Sorting:**
- Sort by Title, URL, Domain, or Recent usage
- Sorting is applied after filtering

**Bulk Operations:**
- Check boxes next to tabs to select multiple
- Use bulk actions: Close Selected, Group Selected
- `Ctrl+Shift+A` / `Cmd+Shift+A` to select all visible tabs

**Tab Grouping:**
- **Group by Domain**: Automatically groups tabs from same website
- **Group Selected**: Create custom groups from selected tabs
- Groups are color-coded for easy identification

**Session Management:**
- **Save Session**: Saves all current tabs and windows
- **Restore Session**: View and restore previously saved sessions
- Sessions include tab titles, URLs, and window organization
- Up to 10 sessions are kept automatically

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+T` / `Cmd+Shift+T` | Open Advanced Tab Manager |
| `Ctrl+Shift+D` / `Cmd+Shift+D` | Close duplicate tabs |
| `Ctrl+Shift+S` / `Cmd+Shift+S` | Save current session |
| `Ctrl+F` / `Cmd+F` | Focus search box |
| `Ctrl+Shift+A` / `Cmd+Shift+A` | Select all visible tabs |
| `Escape` | Clear selection |

## 🔒 Privacy & Permissions

The extension requires these permissions:
- **tabs**: To read tab information and switch between tabs
- **storage**: To save sessions and user preferences
- **activeTab**: To activate selected tabs
- **tabGroups**: To create and manage tab groups

**Privacy Notes:**
- All data is stored locally in Chrome's storage
- No data is sent to external servers
- Tab information is only used for management features
- Sessions are stored locally and can be deleted anytime

## 🎨 Customization

### Changing Appearance
- The extension uses your system's default fonts
- Colors follow a modern blue gradient theme
- Responsive design adapts to different screen sizes

### Modifying Behavior
- Edit `popup.js` to change functionality
- Edit `popup.css` to modify appearance
- Edit `manifest.json` to change permissions or shortcuts

## 📊 Performance Tips

- **Regular Cleanup**: Use "Close Duplicates" regularly
- **Session Management**: Save important sessions before major browsing changes
- **Group Similar Tabs**: Use domain grouping for better organization
- **Bulk Operations**: Select multiple tabs for efficient management

## 🆘 Getting Help

If you encounter issues:
1. Check this guide first
2. Look at the browser console for error messages
3. Try disabling other extensions temporarily
4. Restart Chrome and try again
5. Check Chrome version compatibility (Chrome 88+ recommended)

## 🔄 Updates

To update the extension:
1. Download the latest version
2. Go to `chrome://extensions/`
3. Click "Reload" button for Advanced Tab Manager
4. Or remove and re-add the extension

---

**Enjoy better tab management with Advanced Tab Manager!** 🎉
