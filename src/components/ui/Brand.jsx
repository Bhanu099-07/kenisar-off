import footerLogo from '../../assets/kenisar-logo-footer.png'
import iconLogo from '../../assets/kenisar-logo-icon.png'
import navbarLogo from '../../assets/kenisar-logo-navbar.png'

const logoMap = {
  footer: footerLogo,
  icon: iconLogo,
  navbar: navbarLogo,
}

export function BrandLogoImage({ className = '', alt = 'Kenisar logo', variant = 'navbar' }) {
  const source = logoMap[variant] ?? logoMap.navbar

  return <img className={`brand-logo-asset brand-logo-asset--${variant} ${className}`.trim()} src={source} alt={alt} />
}

export function Brand({ compact = false, variant }) {
  const resolvedVariant = variant ?? (compact ? 'navbar' : 'footer')

  return (
    <span className={`brand brand--${resolvedVariant} ${compact ? 'brand--compact' : ''}`}>
      <span className={`brand-logo-frame brand-logo-frame--${resolvedVariant}`}>
        <BrandLogoImage alt="Kenisar" variant={resolvedVariant} />
      </span>
    </span>
  )
}
