// from settings.js import loadSettings, createContextMenu.

// Load current state of settings and create the context menu.
loadSettings().then(createContextMenu);

// Sync with settings as they change.
onSettingsChanged(recreateContextMenu);
