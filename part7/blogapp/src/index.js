import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './blogApp'

import { QueryClient, QueryClientProvider } from 'react-query'
import { MessageContextProvider } from './MessageContext'
import { UserContextProvider } from './UserContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <MessageContextProvider>
          <App />
        </MessageContextProvider>
      </UserContextProvider>
    </QueryClientProvider>
  </Router>
)
