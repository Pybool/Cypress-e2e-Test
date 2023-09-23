Feature: User should be able to create orders for various compartments
As a User I want to crate orders with the available compartments

@automated @rs2-order @rs2-compartments 
Scenario: On ReservationFunctional : Joan 4 Seat minimum requirement is met
    Given I am logged in to reservations2 'uat'
    When I click on 'New Order' button
    When I attempt to create an order selecting '4' adult for when choosing who
    Then The 'Joan Pullman Observation 4-seat compartment' pill is displayed in the select reservation modal with 'Joan Comp. 1' selected
    When I click The 'Seats 1-4' button
    Then The 'Add Seats' button should be active

@automated @rs2-order @rs2-compartments
Scenario: On ReservationFunctional : Joan 4 Seat minimum requirement is met if reservation for 2 children and 2 adult is created
    Given I am logged in to reservations2 'uat'
    When I click on 'New Order' button
    When I attempt to create an order selecting '2' adult and '2' child for when choosing who
    Then The 'Joan Pullman Observation 4-seat compartment' pill is displayed in the select reservation modal with 'Joan Comp. 2' selected
    When I click The 'Seats 5-8' button
    Then The 'Add Seats' button should be active

@automated @rs2-order @rs2-compartments
Scenario: On ReservationFunctional :For closed carriages Seats minimum requirement is met if reservation for 3 children and 3 adult is created
    Given I am logged in to reservations2 'uat'
    When I click on 'New Order' button
    When I attempt to create an order selecting '3' adult and '3' child for when choosing who
    Then For '3 adults 3 children in closed carriages' I select the needed compartments and choose appropriate seats for each respectively
    Then The 'Add Seats' button should be active and i proceed to checkout internally


@automated @rs2-order @rs2-compartments
Scenario: On ReservationFunctional :For semi-open carriages Seats minimum requirement is met if reservation for 3 children and 3 adult is created
    Given I am logged in to reservations2 'uat'
    When I click on 'New Order' button
    When I attempt to create an order selecting '3' adult and '3' child for when choosing who
    Then For '3 adults 3 children in semi-open carriages' I select the needed compartments and choose appropriate seats for each respectively
    Then The 'Add Seats' button should be active and i proceed to checkout internally


@automated @rs2-order @rs2-compartments
Scenario: On ReservationFunctional :For Open carriages Seats minimum requirement is met if reservation for 3 children and 3 adult is created
    Given I am logged in to reservations2 'uat'
    When I click on 'New Order' button
    When I attempt to create an order selecting '3' adult and '3' child for when choosing who
    Then For '3 adults 3 children in open carriages' I select the needed compartments and choose appropriate seats for each respectively
    Then The 'Add Seats' button should be active and i proceed to checkout internally

@automated @rs2-order @rs2-compartment
Scenario: On ReservationFunctional :For Accessible carriages Seats minimum requirement is met if reservation for 3 children and 3 adult is created
    Given I am logged in to reservations2 'uat'
    When I click on 'New Order' button
    When I attempt to create an order selecting '3' adult and '3' child for when choosing who
    Then For '3 adults 3 children in Accessible carriages' I select the needed compartments and choose appropriate seats for each respectively



