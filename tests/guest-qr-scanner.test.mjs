import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/app/pages/GuestEntryPages.tsx', import.meta.url), 'utf8');
const appContextSource = fs.readFileSync(new URL('../src/app/context/AppContext.tsx', import.meta.url), 'utf8');
const rootLayoutSource = fs.readFileSync(new URL('../src/app/layouts/RootLayout.tsx', import.meta.url), 'utf8');

test('add-entry opens the scanner by default while direct code routes stay resolved', () => {
  assert.match(source, /const submittedCode = searchParams\.get\('code'\) \|\| '';/);
  assert.match(source, /const isScannedState = Boolean\(submittedCode && qr\)/);
});

test('successful scans claim immediately and return to Passport', () => {
  const addEntryStart = source.indexOf('export function AddGuestEntryToPassportPage');
  const addEntryEnd = source.indexOf('\nexport function MultiGuestManagerPage', addEntryStart);
  const addEntrySource = source.slice(addEntryStart, addEntryEnd);
  const handleScanStart = addEntrySource.indexOf('const handleScan = useCallback');
  const handleScanEnd = addEntrySource.indexOf('\n\n  const handlePrototypeStateChange', handleScanStart);
  const handleScanSource = addEntrySource.slice(handleScanStart, handleScanEnd);

  assert.match(handleScanSource, /const result = claimGuestEntryQR\(scannedCode\);/);
  assert.match(handleScanSource, /if \(!result\.ok\)/);
  assert.match(handleScanSource, /already_claimed[\s\S]*revoked[\s\S]*Guest QR not found/);
  assert.match(handleScanSource, /navigate\('\/passport', \{ replace: true \}\);/);
  assert.match(handleScanSource, /toast\.success\('Entry added to Passport', \{ description: result\.qr\.eventName \}\);/);
  assert.doesNotMatch(handleScanSource, /\/passport\/add-entry\?code=/);
});

test('scanner exposes close and QR upload actions without manual entry', () => {
  const scannerStart = source.indexOf('function GuestQrScanner(');
  const scannerEnd = source.indexOf('\nfunction GuestQrWebEntry', scannerStart);
  const scannerSource = source.slice(scannerStart, scannerEnd);

  assert.match(source, /aria-label="Close scanner"/);
  assert.match(source, /aria-label="Upload a Guest QR image"/);
  assert.match(scannerSource, /Upload QR/);
  assert.doesNotMatch(scannerSource, /onEnterCode|Enter code/);
  assert.doesNotMatch(source, /capture="environment"/);
});

test('scanner uses a focused neutral camera stage and lightweight inline fallback actions', () => {
  const scannerStart = source.indexOf('function GuestQrScanner(');
  const scannerEnd = source.indexOf('\nfunction GuestQrWebEntry', scannerStart);
  const scannerSource = source.slice(scannerStart, scannerEnd);

  assert.match(scannerSource, /Hold the QR code inside the frame/);
  assert.match(scannerSource, /Ready to scan/);
  assert.match(scannerSource, /Have a saved QR photo\?/);
  assert.match(scannerSource, /Use sample QR/);
  assert.match(scannerSource, /mt-8 flex flex-col items-center gap-1\.5/);
  assert.match(scannerSource, /border-white\/80/);
  assert.match(scannerSource, /min-h-11/);
  assert.match(scannerSource, /w-\[min\(72vw,300px\)\]/);
  assert.doesNotMatch(scannerSource, /guest-qr-scanner-material/);
  assert.doesNotMatch(scannerSource, /backdrop-blur-2xl/);
  assert.doesNotMatch(scannerSource, /rounded-t-\[20px\]/);
  assert.doesNotMatch(scannerSource, /border-x border-t/);
  assert.doesNotMatch(scannerSource, /radial-gradient/);
  assert.doesNotMatch(scannerSource, /Center the QR in the frame/);
  assert.doesNotMatch(scannerSource, /h-14 w-14 -translate-x-1\/2 -translate-y-1\/2/);
  assert.doesNotMatch(scannerSource, /#c8fff2/);
  assert.doesNotMatch(scannerSource, /#0c5147/);
  assert.doesNotMatch(scannerSource, /#0d252d/);
  assert.doesNotMatch(scannerSource, /Don’t have the QR in front of you\?/);
  assert.doesNotMatch(scannerSource, /Move the Guest QR inside the frame/);
  assert.doesNotMatch(scannerSource, /border border-white\/16 bg-black\/45/);
  assert.doesNotMatch(scannerSource, /<Lock className="h-3\.5 w-3\.5" \/>\s*Private/);
  assert.doesNotMatch(scannerSource, /Try a demo scan/);
  assert.doesNotMatch(scannerSource, /text-\[11px\]/);
  assert.doesNotMatch(scannerSource, /bg-black\/\[0\.38\]/);
});

test('sample scan generates a fresh claimable demo QR every time', () => {
  assert.match(source, /Use sample QR/);
  assert.match(source, /function freshDemoGuestQrRef\(\)/);
  assert.match(source, /crypto\.randomUUID\(\)/);
  assert.match(source, /onDetected\(`\/guest-entry\/\$\{freshDemoGuestQrRef\(\)\}`\);/);
  assert.doesNotMatch(source, /onDetected\('\/guest-entry\/GE-TEMP-4021'\);/);
  assert.match(appContextSource, /normalizedRef === 'GE-TEMP-4021' \|\| normalizedRef\.startsWith\('GE-TEMP-4021-'\)/);
});

test('scanned state prioritizes event review and one clear next action', () => {
  assert.match(source, /function ScannedGuestEntryState\(/);
  assert.match(source, /const isScannedState = Boolean\(submittedCode && qr\)/);
  assert.match(source, /Scan another Guest QR/);
  assert.match(source, /Add past event to Passport/);
  assert.match(source, /Review the event details/);

  const resolvedStart = source.indexOf('function ScannedGuestEntryState(');
  const resolvedEnd = source.indexOf('\nexport function AddGuestEntryToPassportPage', resolvedStart);
  const resolvedSource = source.slice(resolvedStart, resolvedEnd);
  assert.match(resolvedSource, /aria-label="Close"/);
  assert.doesNotMatch(resolvedSource, /Back to Passport/);
  assert.doesNotMatch(resolvedSource, />Passport</);
  assert.doesNotMatch(resolvedSource, />Guest QR</);
  assert.doesNotMatch(resolvedSource, /Guest QR code/);
  assert.doesNotMatch(resolvedSource, /'Eligible'/);
});

test('scanned state includes a presentation-only prototype state switcher', () => {
  const resolvedStart = source.indexOf('function ScannedGuestEntryState(');
  const resolvedEnd = source.indexOf('\nexport function AddGuestEntryToPassportPage', resolvedStart);
  const resolvedSource = source.slice(resolvedStart, resolvedEnd);
  const switcherStart = source.indexOf('function PrototypeStateSwitcher(');
  const switcherEnd = source.indexOf('\nfunction inferPrototypeGuestState', switcherStart);
  const switcherSource = source.slice(switcherStart, switcherEnd);

  assert.match(resolvedSource, /PrototypeStateSwitcher/);
  assert.match(switcherSource, /Presentation state/);
  assert.match(switcherSource, /Preview only · no Passport data changes/);
  assert.match(source, /Ready to add/);
  assert.match(source, /Past event/);
  assert.match(source, /Already saved/);
  assert.match(source, /Unavailable/);
  assert.match(source, /demoState/);
  assert.match(source, /GE-DEMO-ADDED/);
});

test('the direct add-entry route hides the global shell', () => {
  assert.match(rootLayoutSource, /const isGuestQrScanner = pathname === '\/passport\/add-entry';/);
  assert.match(rootLayoutSource, /!useFullScreenOverlay && \(/);
});

test('the prototype uses a simulated ready state unless live camera mode is requested', () => {
  assert.match(source, /enableLiveCamera: boolean/);
  assert.match(source, /searchParams\.get\('live'\) === '1'/);
  assert.match(source, /if \(!enableLiveCamera\) \{\s*setStatus\('scanning'\)/);
});

test('desktop web entry offers QR photo upload without code or camera controls', () => {
  assert.match(source, /useIsMobile/);
  assert.match(source, /function GuestQrWebEntry\(/);
  assert.match(source, /Upload QR photo/);

  const webEntryStart = source.indexOf('function GuestQrWebEntry(');
  const webEntryEnd = source.indexOf('\nfunction validDateCopy', webEntryStart);
  const webEntrySource = source.slice(webEntryStart, webEntryEnd);
  assert.doesNotMatch(webEntrySource, /getUserMedia|<video|Flip camera|enableLiveCamera/);
  assert.doesNotMatch(webEntrySource, /Enter the code|Guest QR code|onLookup|onCodeChange|codeInputRef/);
  assert.doesNotMatch(webEntrySource, /grid-cols/);
});

test('desktop web entry uses the shell back control instead of a duplicate close button', () => {
  const webEntryStart = source.indexOf('function GuestQrWebEntry(');
  const webEntryEnd = source.indexOf('\nfunction validDateCopy', webEntryStart);
  const webEntrySource = source.slice(webEntryStart, webEntryEnd);

  assert.doesNotMatch(webEntrySource, /aria-label="Close add to Passport"/);
  assert.doesNotMatch(webEntrySource, /<X className="h-4 w-4"/);
  assert.match(webEntrySource, /showLocalBack/);
  assert.match(webEntrySource, /aria-label="Back to Passport"/);
  assert.match(source, /const \{ claimGuestEntryQR, findGuestEntryQRByRef, isDesktop \} = useAppContext\(\);/);
  assert.match(source, /showLocalBack=\{!isDesktop\(\)\}/);
});

test('mobile branch keeps the existing camera scanner and live-camera opt-in', () => {
  assert.match(source, /const isMobile = useIsMobile\(\)/);
  assert.match(source, /isMobile \? \(/);
  assert.match(source, /<GuestQrScanner[\s\S]*enableLiveCamera=\{searchParams\.get\('live'\) === '1'\}/);
});

test('add-entry keeps manual code entry out of every QR entry state', () => {
  const addEntryStart = source.indexOf('export function AddGuestEntryToPassportPage');
  const addEntryEnd = source.indexOf('\nexport function MultiGuestManagerPage', addEntryStart);
  const addEntrySource = source.slice(addEntryStart, addEntryEnd);

  assert.doesNotMatch(addEntrySource, /Enter code|Enter Guest QR code|handleEnterCode|onEnterCode|codeInputRef/);
  assert.match(addEntrySource, /onScanAgain=\{\(\) => navigate\('\/passport\/add-entry\?scan=1'\)\}/);
});

test('scan retry route cannot retain a previous resolved event', () => {
  const addEntryStart = source.indexOf('export function AddGuestEntryToPassportPage');
  const addEntryEnd = source.indexOf('\nexport function MultiGuestManagerPage', addEntryStart);
  const addEntrySource = source.slice(addEntryStart, addEntryEnd);

  assert.match(addEntrySource, /const submittedCode = searchParams\.get\('code'\) \|\| '';/);
  assert.doesNotMatch(addEntrySource, /setSubmittedCode|isScannerOpen|setIsScannerOpen/);
  assert.doesNotMatch(addEntrySource, /We couldn’t read that Guest QR/);
  assert.match(addEntrySource, /onScanAgain=\{\(\) => navigate\('\/passport\/add-entry\?scan=1'\)\}/);
});
