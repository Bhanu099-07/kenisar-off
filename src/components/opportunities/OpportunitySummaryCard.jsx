import { AppLink } from '../ui/AppLink'
import { StatusBadge } from '../ui/StatusBadge'
import {
  formatDateLabel,
  getOpportunityCommitment,
  getOpportunityDescription,
  getOpportunityLocation,
  getOpportunityMode,
  getOpportunitySkills,
  getOpportunityTitle,
  getOpportunityType,
  getOrganizationName,
} from '../../lib/opportunityPresentation'

export function OpportunitySummaryCard({
  item,
  currentPath,
  onNavigate,
  children,
  organizationHref,
  opportunityHref,
  secondaryMeta = [],
  surfaceClassName = '',
}) {
  const title = getOpportunityTitle(item)
  const organizationName = getOrganizationName(item)

  const metaItems = [
    getOpportunityType(item),
    getOpportunityLocation(item),
    getOpportunityMode(item),
    getOpportunityCommitment(item),
    item?.deadline ? `Deadline ${formatDateLabel(item.deadline)}` : null,
    ...secondaryMeta,
  ].filter(Boolean)

  return (
    <article className={`content-card content-card--light opportunity-surface ${surfaceClassName}`.trim()} data-reveal="card" data-tilt>
      <div className="dashboard-record__header">
        <div className="opportunity-surface__heading">
          {opportunityHref ? (
            <AppLink href={opportunityHref} onNavigate={onNavigate} currentPath={currentPath} className="opportunity-surface__title">
              {title}
            </AppLink>
          ) : (
            <h2>{title}</h2>
          )}

          <div className="opportunity-surface__subhead">
            {organizationHref ? (
              <AppLink href={organizationHref} onNavigate={onNavigate} currentPath={currentPath} className="opportunity-surface__organization">
                {organizationName}
              </AppLink>
            ) : (
              <p>{organizationName}</p>
            )}
          </div>
        </div>

        <StatusBadge status={item?.status} />
      </div>

      <p>{getOpportunityDescription(item)}</p>

      <div className="tag-list tag-list--dense">
        {metaItems.map((metaItem) => (
          <span key={metaItem} className="tag-pill tag-pill--dark">
            {metaItem}
          </span>
        ))}
      </div>

      <p className="opportunity-card__meta">
        <strong>Skills gained:</strong> {getOpportunitySkills(item)}
      </p>

      {children ? <div className="button-row opportunity-surface__actions">{children}</div> : null}
    </article>
  )
}
