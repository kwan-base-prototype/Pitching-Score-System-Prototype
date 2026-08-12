import logoHorizontalWhite from './assets/brand/logo-horizontal-white.png';
import logoHorizontalColor from './assets/brand/logo-horizontal-color.png';
import logoIconOnDark from './assets/brand/logo-icon-color-ondark.png';

/**
 * The official BASE Playhouse logo, from the brand kit in src/assets/brand/.
 *
 * Three variants cover every placement in the app, and picking the right one matters — the mark is
 * dual-tone (black enclosure + red slope), so the colour version disappears on a dark background:
 *
 *   'white'      horizontal lockup, white — for dark surfaces (sign-in, launcher nav)
 *   'color'      horizontal lockup, red + black — for light surfaces
 *   'icon-dark'  icon only, tuned for dark containers — for compact spots like the sidebar
 *
 * The brand guide asks for clear space around the mark, so callers should not crowd it; the
 * `className` is for sizing only.
 */
export type LogoVariant = 'white' | 'color' | 'icon-dark';

const SOURCES: Record<LogoVariant, string> = {
  white: logoHorizontalWhite,
  color: logoHorizontalColor,
  'icon-dark': logoIconOnDark,
};

export function BrandLogo({
  variant = 'color',
  className = '',
}: {
  variant?: LogoVariant;
  className?: string;
}) {
  return (
    <img
      src={SOURCES[variant]}
      alt="BASE Playhouse"
      // The source files are large (up to 3811px wide) so the browser is told to decode off the
      // main thread; they are only ever displayed small.
      decoding="async"
      className={`object-contain ${className}`}
    />
  );
}
