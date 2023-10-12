import './commands'
import 'cypress-iframe'

Cypress.on("uncaught:exception", (e, runnable) =>{
    return false
})
