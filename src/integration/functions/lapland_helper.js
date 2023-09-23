const timeout = { timeout: 40000 }
export async function btndivspan(text) {
  return cy
    .iframe('#ticknovate-frame',timeout)
    .find('span[class^="inlinetextbox_layout_"]',timeout)
    .contains(text,timeout)
    .parent()
    .parent()
    .click({ force: true })
}

export async function continueBooking(text) {
   cy
    .iframe('#ticknovate-frame',timeout)
    .find('span[class^="inlinetextbox_layout_"]',timeout)
    .contains(text,timeout)
    .parent()
    .parent()
    .parent().as('button')
    .should('not.have.attr', 'disabled')
    
    cy.get('@button').click({force:true})
}

