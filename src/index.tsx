import React from 'react'
import ReactDOM from 'react-dom'
import '~/src/index.css'
import { Root } from '~/src/Root'
import reportWebVitals from '~/src/reportWebVitals'
import { init } from '~/src/init'
import { makeAccessible } from '~/src/app'

async function main() {
  const app = await init()
  makeAccessible(app)

  ReactDOM.render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>,
    document.getElementById('root')
  )

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals()
}

main()
