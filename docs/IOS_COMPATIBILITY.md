# iOS Safari Compatibility

## Target Environment

- **Device**: iPhone (primary), iPad (secondary)
- **Browser**: iOS Safari
- **Mode**: PWA (standalone)
- **Min iOS**: 15.0+

## Known Limitations & Mitigations

### 1. Service Worker Limitations

**Limitation**: iOS Safari service workers have stricter lifecycle management. Background sync is not supported.

**Mitigation**:
- Use `registerType: "autoUpdate"` for SW updates
- Cache-first strategy for static assets
- Network-first for dynamic content with offline fallback
- No reliance on background sync

**Impact**: Low — core learning works offline via IndexedDB.

### 2. IndexedDB Quota

**Limitation**: iOS Safari may limit IndexedDB storage. Safari prompts user at ~50MB.

**Mitigation**:
- Efficient data storage (avoid duplicates)
- Implement data export/import
- Compress audio data references (store URLs, not blobs)
- Monitor usage and warn user before limits

**Impact**: Low — text-based learning data is small. Audio should use URLs.

### 3. Audio Playback

**Limitation**: iOS Safari requires user gesture to start audio. Auto-play is blocked.

**Mitigation**:
- Always trigger audio via user tap
- Use `touchstart` or `click` handlers
- Show play button for audio content
- Graceful fallback if audio unavailable

**Impact**: Medium — pronunciation and listening exercises need audio.

### 4. Microphone Access

**Limitation**: iOS Safari requires HTTPS for microphone access. GitHub Pages is HTTPS.

**Mitigation**:
- Use `navigator.mediaDevices.getUserMedia()`
- Request permission with clear UI explanation
- Graceful degradation: text-only mode if denied
- Feature detection before use

**Impact**: Medium — speaking exercises degraded without mic.

### 5. PWA Installation

**Limitation**: iOS does not support `beforeinstallprompt` event. Users must use Share → Add to Home Screen.

**Mitigation**:
- Show manual install instructions
- Detect standalone mode via `navigator.standalone`
- Use `apple-mobile-web-app-capable` meta tag
- Optimize standalone display

**Impact**: Low — app works in browser too.

### 6. Safe Areas (Notch / Dynamic Island)

**Limitation**: iPhones with notches need safe area insets.

**Mitigation**:
- `viewport-fit=cover` in meta tag
- CSS `env(safe-area-inset-*)` variables
- Test on multiple device sizes

**Impact**: Low — addressed via CSS.

### 7. Viewport Height

**Limitation**: Address bar causes viewport height changes on scroll.

**Mitigation**:
- Use `100dvh` (dynamic viewport height)
- Fallback: `100vh` with JS adjustment
- Test scroll behavior

**Impact**: Low — CSS handles this.

### 8. Web Speech API

**Limitation**: `SpeechRecognition` is not available in iOS Safari. `SpeechSynthesis` is available but limited.

**Mitigation**:
- Use Web Speech API where available
- Fallback to text-based exercises
- Future: Server-side speech recognition via AI provider
- `SpeechSynthesis` for pronunciation examples

**Impact**: High — speaking exercises need alternative path for iOS.

### 9. Background Processing

**Limitation**: iOS Safari aggressively suspends background tabs and service workers.

**Mitigation**:
- All data persisted immediately to IndexedDB
- No reliance on background timers
- Resume from last state on reactivation

**Impact**: Low — local-first design handles this.

### 10. CSS `position: fixed`

**Limitation**: `position: fixed` can behave unexpectedly in iOS Safari, especially with virtual keyboard.

**Mitigation**:
- Use `position: sticky` where possible
- Handle virtual keyboard resize events
- Test with keyboard open/close

**Impact**: Low — avoid fixed positioning for critical UI.

## Risk Summary

| Risk | Impact | Likelihood | Status |
|------|--------|------------|--------|
| Service Worker lifecycle | Low | High | Mitigated |
| IndexedDB quota | Low | Medium | Mitigated |
| Audio autoplay | Medium | High | Mitigated |
| Microphone access | Medium | Medium | Mitigated |
| PWA install UX | Low | High | Mitigated |
| Safe areas | Low | High | Mitigated |
| Viewport height | Low | High | Mitigated |
| Web Speech API | High | High | Partially mitigated |
| Background processing | Low | Medium | Mitigated |
| Fixed positioning | Low | Medium | Mitigated |

## Testing Checklist

- [ ] iPhone 14 Pro (Dynamic Island)
- [ ] iPhone SE (small screen)
- [ ] iPhone 15 Pro Max (large screen)
- [ ] iPad (landscape/portrait)
- [ ] Standalone mode
- [ ] Offline mode
- [ ] Audio playback
- [ ] Microphone recording
- [ ] PWA install flow
- [ ] Virtual keyboard handling
- [ ] Scroll behavior
- [ ] Long study session (battery/memory)
