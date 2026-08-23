/**
 * Extended Navigator interface for iOS Safari PWA detection
 */
interface Navigator {
  /**
   * `true` when running as a standalone PWA on iOS Safari.
   * Only available on iOS Safari.
   */
  standalone?: boolean;
}
