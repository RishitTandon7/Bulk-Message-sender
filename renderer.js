const groupsInput = document.getElementById('groupsInput');
const messagesInput = document.getElementById('messagesInput');
const saveGroupsBtn = document.getElementById('saveGroupsBtn');
const resetDoneBtn = document.getElementById('resetDoneBtn');
const openWhatsAppBtn = document.getElementById('openWhatsAppBtn');
const startSendingBtn = document.getElementById('startSendingBtn');
const logOutput = document.getElementById('logOutput');
const qrImage = document.getElementById('qrImage');
const readyDot = document.getElementById('readyDot');
const readyLabel = document.getElementById('readyLabel');
const readySubtitle = document.getElementById('readySubtitle');

let clientReady = false;

function parseGroups(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseMessages(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line, index, lines) => line.length > 0 || (index > 0 && lines[index - 1].length > 0));
}

function setReadyState(ready) {
  clientReady = Boolean(ready);
  readyDot.classList.toggle('online', ready);
  readyLabel.textContent = ready ? 'Ready to send' : 'Waiting for login';
  readySubtitle.textContent = ready
    ? 'WhatsApp client is connected'
    : 'Scan the QR code to authenticate';
  startSendingBtn.disabled = !ready;
  startSendingBtn.textContent = ready ? 'Start Sending' : 'Scan QR first';
}

function appendLog(message) {
  const entry = document.createElement('div');
  entry.className = 'log-line';
  entry.textContent = message;
  logOutput.appendChild(entry);
  logOutput.scrollTop = logOutput.scrollHeight;
}

function loadState(state) {
  if (state && Array.isArray(state.groups)) {
    groupsInput.value = state.groups.map((group) => group.name).join('\n');
  }

  if (state && state.qr) {
    qrImage.src = state.qr;
    qrImage.classList.add('visible');
  }

  if (state && typeof state.ready === 'boolean') {
    setReadyState(state.ready);
  }
}

window.waSender.onLog((message) => appendLog(message));
window.waSender.onState((state) => loadState(state));
window.waSender.onQr((qr) => {
  qrImage.src = qr;
  qrImage.classList.add('visible');
  appendLog('QR code updated.');
});
window.waSender.onReady((ready) => setReadyState(ready));

async function refresh() {
  const state = await window.waSender.getState();
  loadState(state);
}

saveGroupsBtn.addEventListener('click', async () => {
  const groups = parseGroups(groupsInput.value);
  const result = await window.waSender.saveGroups(groups);
  groupsInput.value = result.groups.map((group) => group.name).join('\n');
  appendLog(`Saved ${result.groups.length} group(s).`);
});

resetDoneBtn.addEventListener('click', async () => {
  const result = await window.waSender.resetDoneToday();
  groupsInput.value = result.groups.map((group) => group.name).join('\n');
  appendLog('Cleared today\'s sent flags.');
});

openWhatsAppBtn.addEventListener('click', async () => {
  await window.waSender.openWhatsApp();
  appendLog('Opened WhatsApp Web in your browser.');
});

startSendingBtn.addEventListener('click', async () => {
  if (!clientReady) {
    appendLog('WhatsApp is not ready yet. Scan the QR code first.');
    return;
  }

  const groups = parseGroups(groupsInput.value);
  const messages = parseMessages(messagesInput.value);
  startSendingBtn.disabled = true;
  appendLog('Starting send run...');

  try {
    const result = await window.waSender.startSending({ groups, messages });
    appendLog(`Finished. Sent to ${result.sentCount} group(s) today.`);
    groupsInput.value = result.groups.map((group) => group.name).join('\n');
  } catch (error) {
    appendLog(`Error: ${error.message}`);
  } finally {
    startSendingBtn.disabled = false;
  }
});

refresh().catch((error) => appendLog(`Failed to load state: ${error.message}`));