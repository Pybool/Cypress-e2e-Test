export const BASE_URL = {
  rs2: {
    qa4: Cypress.env('RES2_QA4'),
    uat: Cypress.env('RES2_UAT'),
  },
  qa4: Cypress.env('ADMIN_QA3'),
  lapland: Cypress.env('TENANT_ADMIN_URL_LAPLAND'),
  uat:  Cypress.env('ADMIN_UAT')
}
