import officialLogo from '../../assets/kenisar-logo-official.png'

export function BrandLogoImage({ className = '', alt = 'Kenisar logo' }) {
  return <img className={`brand-logo-asset ${className}`.trim()} src={officialLogo} alt={alt} />
}

export function Brand({ compact = false }) {
  return (
    <span className={`brand ${compact ? 'brand--compact' : ''}`}>
      <span className="brand-logo-frame">
        <BrandLogoImage alt="Kenisar" />
      </span>
    </span>
  )
}
