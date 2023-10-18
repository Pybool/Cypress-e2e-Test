Feature: Admin regression page load
As a User I want to validate the reservation page preview widget for draft orders
    

@automated @automated-validate-page @automated-rs2
Scenario: On ReservationFunctional :Verify that on the Reservations table when a row is clicked the Order Preview widget appears and has the correct contents
    Given I am logged in to reservations2 'uat'
    Given I have created an order as a customer
    When I am on the reservations page
    Then I should be on the base url
    When I click on the a row in the table for a draft order
    Then I should see the Order Preview widget 
    And The Order Preview widget should contain "Customer Details:" "Booking Details:" "Ticket Details:" and "Total:" section
    And The Order Preview widget should have a "View Order Details" button with background colors "rgb(125, 227, 203)"
