Feature: Admin regression page load
As a User I want to validate the reservation page

@automated @rs2 @automating-validate-page
Scenario: On ReservationFunctional :Verify that the New Order page is rendered correctly
    Given I am logged in to reservations2 'uat'
    When I am on the New Order page
    Then I should see that the page header is "New Order"
    And I should see the market selection dropdown as the first component on the card below the page header
    And I should see the Travel Button next to the market selection dropdown
    And I should see the Event Button next to the Travel Button
    And I should see the Add return single trip radio after the Event Button
    When The Travel Button in the First Card is clicked
    Then Below the first card I should a second card containing a "Swap Locations" button

    And In the "firstLayer" of the second card i should see a "From" dropdown and "To" dropdown
    And In the "secondLayer" of the second card i should see a "Who" dropdown and "when" dropdown
    Then The "Who" and "when" buttons should be disabled by default if the "To" button was not selected
    And The Cart Section should be visible and have a header with text "Cart"
    And A "Clear All" Button should be visible beside the header