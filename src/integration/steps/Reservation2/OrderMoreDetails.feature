# URL: https://reservations2.lakedistrict.ticknovate-uat.com/

Feature: User should be able to view order details 
As a User I want to access orders section So I view order details

@automated @rs2
Scenario: User should be able to perform More actions on Bookings Page
    Given I am logged in to reservations2 'uat'
    Given I have created an order as a customer
    Then I click the View button in Search Orders for a previously created order
    When I click the More Actions Button beside Edit Order
    Then I should see a dropdown displayed
    And The dropdown should contain an option "Download Tickets"
    And The dropdown should contain an option "Resend Confirmation"
    And The dropdown should contain an option "View Message History"
    And The dropdown should contain an option "View Redemption History"
    And The dropdown should contain an option "View Transaction History"
    And The dropdown should contain an option "Cancel Order" which should have color "rgb(217, 63, 28)"

@automated @rs2
Scenario: User should be able to perform More actions on Bookings Page clicking on each option
    Given I am logged in to reservations2 'uat'
    Then I click the View button in Search Orders for a previously created order
    When I click the More Actions Button beside Edit Order
    When I click on "Download Tickets" option
    Then I should see a "confirmation" pdf file downloaded
    When I click on "Resend Confirmation" option
    Then I should see a modal with Resend Email Header an Email address Label and and Input Field for the email and a Resend button
    When I clear the email input field
    Then The Resend Button should be disabled
    When I reenter the valid email
    Then The Resend Button should be enabled
    When I click the Resend Button
    Then I should see a bottom toast with Background color "rgb(56, 161, 105)" with title "Email sent" and body "The confirmation email has been re-sent." and the modal should not be displayed
    When I click on "View Message History" option
    Then I should see a modal with title "Message History"
    And The modal should have a table with headers "Action, Delivery, Result"
    When I click the modal close button
    Then The "Message History" modal should be closed

    When I click on "View Redemption History" option
    Then I should see a modal with title "Redemption History"
    When I click the modal close button
    Then The "Redemption History" modal should be closed

    When I click on "View Transaction History" option
    Then I should see a modal with title "Transaction History"
    And The modal should have a table with headers "Date, Transaction ID, Note, Provider, Method, Type, Total, Total All Time"
    When I click the modal close button
    Then The "Transaction History" modal should be closed

    When I click on "Cancel Order" option
    Then I should be taken to "Amending Booking" page
    And I should see text "The order will be cancelled" which should have color "rgb(217, 63, 28)"
    
    