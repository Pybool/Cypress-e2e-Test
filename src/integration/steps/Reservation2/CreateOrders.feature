Feature: User should be able to create orders 
As a User I want to access orders section So I create orders

@automated @rs2-functional @rs2-create-order
Scenario: On ReservationFunctional : Create an order
    Given I am logged in to reservations2 'uat'
    When I click on 'New Order' button
    When I attempt to create an order selecting '2' adult and '2' child for when choosing who
    Then For '2 adults 2 children' I select the needed compartments and choose appropriate seats for each respectively
    Then The 'Add Seats' button should be active and i proceed to checkout internally
    Then I confirm the new order matches with the information from datasource	

@automated @rs2-functional @rs2-create-order @till
Scenario: On ReservationFunctional : Create an order with Payment By T2' child for when choosing who
    Given I am logged in to reservations2 'uat'
    When I click on 'New Order' button
    When I attempt to create an order selecting '2' adult and '2' child for when choosing who
    Then For '2 adults 2 children' I select the needed compartments and choose appropriate seats for each respectively
    Then The 'Add Seats' button should be active and i proceed to checkout by paying by till
    Then I confirm the new order is displayed in the orders table	

@automated @rs2-order @rs2-functional 
Scenario: On ReservationFunctional : Joan 4 Seat minimum requirement not met
    Given I am logged in to reservations2 'uat'
    When I click on 'New Order' button
    When I attempt to create an order selecting '1' adult for when choosing who
    Then The 'Joan Pullman Observation 4-seat compartment' pill is not displayed in the select reservation modal


@automated @rs2-functional @rs2-create-order
Scenario: On ReservationFunctional : Create an order with return ticket
    Given I am logged in to reservations2 'uat'
    When I click on 'New Order' button
    When I check the 'Add return single trip' checkbox
    Then I should see 'Outbound Options' and 'Return Options' sections for choosing time
    When I select '2' adult when choosing who
    Then I should see available times in 'Outbound Options' all 'Enabled'
    Then I should see available times in 'Return Options' all 'Disabled'
    When I select the first available time in 'Outbound Options'
    Then Atleast 1 time in 'Return Options' should be enabled
    Then The 'Add To Cart' button should be 'Disabled'
    When I select the first available time in 'Return Options'
    Then The 'Add To Cart' button should be 'Enabled'
    Then In the reservation modal i should see 'Dalegarth station - Ravenglass station' with its compartments
    Then In the reservation modal i should see 'Ravenglass station - Dalegarth station' with its compartments
    Then I checkout and pay
