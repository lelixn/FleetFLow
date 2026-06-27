import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

type Props = {
  children: React.ReactNode
}

type State = {
  hasError: boolean
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // Keep logs for developers while showing a graceful screen to users.
    console.error('Unhandled UI error:', error)
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
          <div className="ff-card w-full max-w-md p-6 text-center">
            <div className="mx-auto mb-4 w-10 h-10 rounded-sm border border-[#4a1e1e] bg-[#2b0d0d] flex items-center justify-center">
              <AlertTriangle size={18} className="text-[#f0a8a8]" />
            </div>
            <h1 className="text-[16px] font-semibold mb-2">Something went wrong</h1>
            <p className="text-[13px] text-[#888888] mb-5">
              The app hit an unexpected issue. Reload to recover and continue.
            </p>
            <button onClick={this.handleReload} className="ff-btn ff-btn-primary mx-auto">
              <RotateCcw size={14} /> Reload app
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

