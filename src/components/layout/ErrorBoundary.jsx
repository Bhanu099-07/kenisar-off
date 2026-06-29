import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__card">
            <h1>Something went wrong</h1>
            <p>Please reload the page and try again.</p>
            <button type="button" className="button button--filled" onClick={this.handleReload}>
              Reload page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
