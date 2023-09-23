export const setBaseUrl = async (url) => {
  await Cypress.config('baseUrl', url)
}
