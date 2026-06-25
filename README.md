# WhatsApp Group Bulk Sender

A simple desktop app for sending the same message to a list of WhatsApp groups in batches of 5.

## What it does

- Saves your group list locally
- Lets you write one or more message blocks
- Sends to groups in batches of 5
- Remembers which groups were already sent today
- Keeps a local WhatsApp Web session after you scan the QR code once

## Requirements

- Windows
- Node.js 18 or newer
- WhatsApp on your phone

## Install

From the project folder:

```powershell
npm install
```

## Run

Start the app with:

```powershell
npm start
```

Then:

1. Enter your group names in the left box, one per line.
2. Enter your message in the middle box.
3. Wait until the status shows `Ready to send`.
4. Click `Start Sending`.

## Export

To package the app:

```powershell
.\build_app.ps1
```

The working portable export is created in:

```text
dist\WhatsApp-Group-Bulk-Sender.zip
```

## Data files

- `groups.json` stores your saved groups and daily sent state.
- `wa_browser_profile/` was used by the earlier Python version and can be ignored now.
- `dist/` contains build output.

## Notes

- The app uses its own WhatsApp Web session inside Electron.
- You do not need to log into your normal browser.
- Scan the QR code inside the app the first time, then it should stay logged in locally.