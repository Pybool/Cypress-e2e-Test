export const BASE_URL = {
  rs2: {
    qa4: Cypress.env('RES2_QA4'),
    uat: Cypress.env('RES2_UAT'),
  },
  backend: Cypress.env('ADMIN_URL_TEST'),
  'backend-uat': Cypress.env('ADMIN_URL_UAT'),
  lapland: Cypress.env('TENANT_ADMIN_URL_LAPLAND'),
  lakedistrict:  Cypress.env('TENANT_ADMIN_URL_LAKEDISTRICT')
}
