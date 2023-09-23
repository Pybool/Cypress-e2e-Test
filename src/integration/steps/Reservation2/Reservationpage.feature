Feature: Admin regression page load
As a User I want to validate the reservation page

@automated @validate-page @rs2
Scenario: On ReservationFunctional :Verify that the Reservations page is rendered correctly
    Given I am logged in to reservations2 'uat'
    When I am on the reservations page
    Then I should be on the base url
    Then I should see a greeting "Hi Tayé"
    And I should see that the page header is "Welcome to Reservations"
    And I should see the New Order button having an Icon on the top right of the page
    Then Below the New Order button i should see three buttons "New Order" and "Search Orders" and "Scan QR" on the page
    Then Below the three buttons I should see a search bar with placeholder text "Search Order Reference" in grey color
    And Beside the search bar I should see a Date Filter Having Values "Today" and "Yesterday" and "Last 7 days" and "Last 30 days" in dropdown
    Then Below The search bar I should see a table having "5" headers with texts "Reference", "Status", "Order Placed", "Name", "Phone Number" as headers
    And If there are no records in the table i should see "No results for your search." in table
    And If there are records i should not see "No results for your search." in table

@automated @automated-validate-page @automated-rs2
Scenario: On ReservationFunctional :Verify that on the Reservations table when a row is clicked the Order Preview widget appears and has the correct contents
    Given I am logged in to reservations2 'uat'
    When I am on the reservations page
    Then I should be on the base url
    When I click on the a row in the table for an order ID
    Then I should see the Order Preview widget 
    And The Order Preview widget should contain "Customer Details:" "Booking Details:" "Ticket Details:" and "Total:" section
    And The Order Preview widget should have a "View Order Details" button with background colors "rgb(125, 227, 203)"

@automated @automated-validate-page @automated-rs2
Scenario: On ReservationFunctional :Verify that on the Order Preview contact details section has the correct details
    Given I am logged in to reservations2 'uat'
    When I am on the reservations page
    Then I should be on the base url
    When I click on the a row in the table for an order ID
    Then I should see the Order Preview widget 
    And The Order Preview widget "Customer Details:" should contains a Name Label and the name in the Table matches the name on the Label value
    And The Order Preview widget "Customer Details:" should contains a Email Label and the Email should be a valid Email Address

@automated @automated-validate-page @automated-rs2
Scenario: On ReservationFunctional :Verify that if Booking Details shows Redeemed the Redeem Booking Button does not show and Vice Versa
    Given I am logged in to reservations2 'uat'
    When I am on the reservations page
    Then I should be on the base url
    When I click on the a row in the table for an order ID
    Then I should see the Order Preview widget 
    When The "Booking Details:" section in Booking Redemption shows "Tickets not redeemed" The "Redeem Booking" button does show and Vice Versa
