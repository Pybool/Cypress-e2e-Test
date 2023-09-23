# URL: https://reservations2.lakedistrict.ticknovate-uat.com/

Feature: User should be able to view order details 
As a User I want to access orders section So I view order details

# @automated @order-bookings @rs2
# Scenario Outline: User should be able to view Booking Information
#     Given I am logged in to reservations2 'uat'
#     When I click the View button in Search Orders for a previously created order
#     Then The "<Booking Information>" displays and matches "<Selection>"

#     Examples:
#     | Booking Information 					| Selection	 				|
#     |Location								| Dalegarth Station - Ravenglass Station	 	|
#     | Date 									| Tomorrow Date			|
#     | Time									| Current Time					|
#     | Ticket Price:  						| Adult £28.00 					|
#     | amount								| x1						|

@automated @order-bookings @rs2
Scenario: On ReservationFunctional : User should be able to view More Information
    Given I am logged in to reservations2 'uat'
    When I click the View button in Search Orders for a previously created order
    And I click "More Information" dropdown
    Then The "More Information" section displays data consistent with the order created

@automated @order-bookings @rs2
Scenario: On ReservationFunctional : User should be able to view Contact Details Information
    Given I am logged in to reservations2 'uat'
    When I click the View button in Search Orders for a previously created order
    And I click "Contact Details" dropdown
    Then The "Contact Details" section displays data consistent with the order created


@automated @order-bookings @rs2
Scenario: On ReservationFunctional : User should be able to Redeem Booking
    Given I am logged in to reservations2 'uat'
    When I click the View button in Search Orders for a previously created order
    When I click the 'Redeem Booking' History on bookings page
    Then I ensure that the 'Redeem Booking' Modal is visible and the 'Redeem OrderID' header is visible
    Then I ensure that the Redeem Selected Ticket Button is disabled by default
    When I check all ticket options checkboxes
    Then I ensure that the Redeem Selected Ticket Button is enabled
    When I click the Redeem Selected Ticket Button
    Then The modal is closed and i should see Redeemed under the QR Code