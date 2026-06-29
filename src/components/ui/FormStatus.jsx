export function FormStatus({ status, message, successTitle, successMessage }) {
  if (status === 'success') {
    return (
      <div className="success-state" role="status">
        <h2>{successTitle}</h2>
        <p>{successMessage}</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="form-status form-status--error" role="alert">
        <p>{message}</p>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="form-status form-status--loading" role="status" aria-live="polite">
        <p>Submitting...</p>
      </div>
    )
  }

  return null
}
