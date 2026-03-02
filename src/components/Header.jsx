export function Header({ onHome, showLogo, isMirror }) {
  return (
    <header className="topbar">
      <div 
        className="brand-block shell-card" 
        onClick={isMirror ? undefined : onHome} 
        style={{ 
          cursor: isMirror ? 'default' : 'pointer',
          opacity: showLogo ? 1 : 0,
          transition: 'opacity 0.8s ease-in'
        }}
      >
        <img src="/assets/logo/format_thoughts_logo.png" alt="FormatThoughts" className="header-logo" />
      </div>
    </header>
  )
}
