import React, { ReactElement } from 'react'
import ReactDOM from 'react-dom'
import '~/src/index.css'
import { Root } from '~/src/Root'
import { reportWebVitals } from '~/src/services/report-web-vitals'
import { init } from '~/src/app/init'
import { globalize } from '~/src/app'

import config from '~/config.json'
import credentials from '~/credentials.json'

function render(Element: ReactElement) {
  ReactDOM.render(
    <React.StrictMode>
      {Element}
    </React.StrictMode>,
    document.getElementById('root')
  )
}

async function main() {
  const app = await init(config, credentials)
  globalize(app)

  render(<Root />)

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals()
}

main()
