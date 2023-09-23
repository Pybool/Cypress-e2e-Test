Feature: Customer should be able to manage order
    As a customer i want to manage orders on the customer portal


# @automated @magiclink
# Scenario: Customer clicks magic link after 24 hours and Verify the Bookings Section
#     Given I am logged in to reservations2 'uat'
#     Given I have created an order as a customer 
#     Then I get the previous order Order ID
#     And I click the "Manage Bookings" button in my email after 24 hours
#     Then I should see "Bookings" as a header in the page that loads
#     And I should see "Ticket Price", "Reservation" and "Total:" sections under Bookings
#     And I should not see The Edit button on the Page
#     And I should see the "More Actions" dropdown with "Download Tickets" option
#     And I should see that the QrCode is "Not Redeemed" with "rgb(97, 189, 63)" Background color

# @automated @magiclink
# Scenario: Customer clicks magic link after 24 hours and Verify the Order Information Section
#     Given I am logged in to reservations2 'uat'
#     Then I get the previous order Order ID
#     And I click the "Manage Bookings" button in my email after 24 hours
#     Then I should see "Order Information" as a header in the page that loads
#     And I should see "Order Details", "Contact Details" and "Billing Details" Accordions
#     And I should not see The Edit button on the Page
#     And I should see the "More Actions" dropdown with "Download Tickets" option
#     And I should see that the QrCode is "Not Redeemed" with "rgb(97, 189, 63)" Background color
#     When I click "Order Details" dropdown
#     Then The "Order Details" section displays data consistent with the order created
#     When I click "Contact Details" dropdown
#     Then The "Contact Details" section displays data consistent with the order created


# @automated @magiclink
# Scenario: Customer clicks magic link after 24 hours to verify Request Magik link page sends an email
#     Given I am logged in to reservations2 'uat'
#     Then I get the previous order Order ID
#     And I click the "Manage Bookings" button in my email after 24 hours for order "ULOQIBOXHJM33"
#     Then The magic link takes the customer to the "Request a magic link" page
#     And The order reference 'ULOQIBOXHJM33' is pre-populated
#     When the 'Request magic link' button is clicked
#     Then I should see 'Magic link sent' header in the page that loads
#     And I should see body text with 'A new magic link has been sent to your email.' in the page that loads

# @automated @magiclink
# Scenario: Customer enters invalid order reference
#     Then I get the previous order Order ID
#     And I click the "Manage Bookings" button in my email after 24 hours for order "ULOQIBOXHJM33"
#     Then The magic link takes the customer to the "Request a magic link" page
#     And The customer enters an invalid order reference 'Invalid@Reference'
#     When the 'Request magic link' button is clicked
#     Then I should see an error alert with title 'Something went wrong' and description 'Please, make sure you have used a valid booking reference.'


# @automated @magiclink
# Scenario: Verify that the customer can access the order amendment functionality in the customer portal and Verify that the customer can successfully modify travel/ event dates & times, ticket types, capacity options, or add-ons for each booking in an order
#     Given I am logged in to reservations2 'uat'
#     Then I get the previous order Order ID
#     And I click the "Manage Bookings" button in my email after 24 hours
#     Then I should see "Order Information" as a header in the page that loads
#     When I click the "Edit Order" button
#     Then I should be taken to "Amending Booking" page
#     And I should see "From,To,Who,when" sections
#     And I should see "Available Options" card which should contain "Previous Day" and "Next Day"
#     Then I click the Edit Order Button beside More Actions dropdown
#     When I edit the 'Who' section by removing '1x Adult'
#     Then I should no longer see the "Reservation" Seating Compartments section
#     When I click the "Discard edits and return to order" button to return to the Order Page
#     Then I click the Edit Order Button beside More Actions dropdown
#     When I edit the 'Date' section by clicking the 'Previous Day' button
#     Then I should no longer see the "Reservation" Seating Compartments section
#     When I click the "Discard edits and return to order" button to return to the Order Page
#     Then I click the Edit Order Button beside More Actions dropdown

@automated @magiclink
Scenario: Amend an order nby removing an adult from the booking
    Given I am logged in to reservations2 'uat'
    Then I get the previous order Order ID
    And I click the "Manage Bookings" button in my email after 24 hours
    Then I should see "Order Information" as a header in the page that loads
    Then I should see the "Edit Order" button
    When I click the "Edit Order" button
    Then I should be taken to "Amending Booking" page
    And I should see "From,To,Who,when" sections
    And I should see "Available Options" card which should contain "Previous Day" and "Next Day"
    Then I click the Edit Order Button beside More Actions dropdown
    When I edit the 'Who' section by removing '1x Adult'
    Then I should no longer see the "Reservation" Seating Compartments section
    When I edit the 'Date' section by clicking the 'Previous Day' button
    When I select a time for RES Single Train Ride
    # Then I select seats in the reservation compartment section
    Then The "Commit Changes" Button should be Active
    Then I click the "Commit Changes" button on customer portal
    Then The "Refund" Button should be Active if The Sub Total is negative else the "Checkout" Button should be active where either button is the action button
    Then I click the action button
    And I process a refund or checkout
    Then I should see that the order completed successfully
    Then I ckick the view order button to verify all changes are reflected


@automated @magiclinkcancel
Scenario: Customer can initiate the cancellation process for a booking through the customer portal.
    Given I am logged in to reservations2 'uat'
    Then I get the previous order Order ID
    And I click the "Manage Bookings" button in my email after 24 hours
    When I click the "Edit Order" button
    When I am on the Amending Booking page I click cancel order button
    And I should see a Refund Button
    When I click on the Refund Button
    Then I should be taken to the Refund page
    When I click the "Complete refund" Button
    Then I should see "Booking cancelled" header with color "rgb(117, 164, 14)" and "Your booking has been cancelled" header

@automated @magiclinkcancel
Scenario: Expired bookings cannot be cancelled
    Given I am logged in to reservations2 'uat'
    Then I get the previous order Order ID
    And I click the "Manage Bookings" button in my email after 24 hours
    When I click the "Edit Order" button
    When I am on the Amending Booking page I click cancel order button
    And I should see a Refund Button
    When I click on the Refund Button
    Then I should be taken to the Refund page
    When I click the "Complete refund" Button
    Then I should see "Booking cancelled" header with color "rgb(117, 164, 14)" and "Your booking has been cancelled" header


# Expired bookings cannot be cancelled
# ORDER CANCELLATIONS and REFUNDS

#     Scenario: Expired bookings cannot be cancelled
#     Scenario: Redeemed bookings cannot be cancelled
#     Scenario: Initiate Cancellation process 
#     Scenario: Refund for card payment can be processed automatically
#     Scenario: Verify that refunds for mixed payment types (card + another type) or payment types other than card can be saved but put the whole order in a "pending refund" state and the customer is informed to contact customer service to process the refund.
#     Scenario: Bookings in "pending refund" state can not be cancelled
#     Scenario: Expired orders cannot be cancelled
#     Scenario: Partially-redeemed orders cannot be cancelled
#     Scenario: Redeemed orders cannot be cancelled
#     Scenario: Cancel an order and refund manually
#     Scenario: Cancel an order and refund automatically (check other options)
#     Scenario: Donations can be  refunded 
#     Scenario: Customer receives cancellation confirmation email
#     Scenario: Cancellation status displays in portal
#     Scenario: Cancelled tickets can not be redeemed