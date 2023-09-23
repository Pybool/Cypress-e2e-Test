Feature: User should be able to amend boookings 
As a User I want to access orders section So I amend boookings

Background:Background
    Given I am logged in to reservations2 'uat'
    When I click the view button for an order in the orders table
    Then I ensure the order to be amended matches my last created order
    Then I click the "Edit Order" Button beside "Go to Dashboard" button
    Then I should be taken to "Amending Booking" page

# @automated @amend-bookings @rs2
# Scenario: On ReservationFunctional : Ensuring that the amend booking page responds accordingly to change events

#     And I should see "From,To,Who,when" sections
#     And I should see "Available Options" card which should contain "Previous Day" and "Next Day"
#     And At least a time selection must be selected
#     And I should see a compartment section with a compartment selected
#     And I should see atleast a seat is selected for the compartment
#     When I proceed to change route by clicking the green swap location toggle
#     Then I should no longer see the "Reservation" Seating Compartments section
#     When I click the "Discard edits and return to order" button to return to the Order Page
#     Then I click the Edit Order Button beside More Actions dropdown
#     When I edit the 'Who' section by removing '1x Adult'
#     Then I should no longer see the "Reservation" Seating Compartments section
#     When I click the "Discard edits and return to order" button to return to the Order Page
#     Then I click the Edit Order Button beside More Actions dropdown
#     When I edit the 'Date' section by clicking the 'Next Day' button
#     Then I should no longer see the "Reservation" Seating Compartments section
#     When I click the "Discard edits and return to order" button to return to the Order Page
#     Then I click the Edit Order Button beside More Actions dropdown

@automated @amend-save-bookings @rs2
Scenario: On ReservationFunctional : Ensuring that a booking can be amended by removing an Adult

    When I proceed to change route by clicking the green swap location toggle
    Then The "Commit Changes" Button should be Inactive
    When I edit the 'Who' section by removing '1x Adult'
    When I edit the 'Date' section by clicking the 'Next Day' button
    When I select a time for 'Add-Ons' Single Train ride
    Then I select seats in the reservation compartment section
    Then The "Commit Changes" Button should be Active
    Then I click the "Commit Changes" button
    Then The "Refund" Button should be Active if The Sub Total is negative else the "Checkout" Button should be active where either button is the action button
    Then I click the action button
    And I process a refund or checkout
    Then I should see that the order completed successfully
    Then I ckick the view order button to verify all changes are reflected