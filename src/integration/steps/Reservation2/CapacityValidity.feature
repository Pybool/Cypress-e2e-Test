Feature: Verify that the compartments are available when Minimum requirements are met
As a User I want to crate orders with the available compartments

@automated
Scenario: Verify that 4-seat compartments is only available when a Minimum of 2 persons are in cart
    Given I am logged in to reservations2 'uat'
    When I click on 'New Order' button
    When I attempt to create an order selecting '2' adult for when choosing who
    Then The '4-seat compartment' compartments are displayed in the select reservation modal
    Then I close the compartments modal
    When I attempt to create an order selecting '1' adult for when choosing who
    Then The '4-seat compartment' compartments are not displayed in the select reservation modal
    
@automated
Scenario: Verify that Joan Pullman Observation seat is only available when a Minimum of 1 persons are in cart
    Given I am logged in to reservations2 'uat'
    When I click on 'New Order' button
    When I attempt to create an order selecting '1' adult for when choosing who
    Then The 'Joan Pullman Observation seat' compartments are displayed in the select reservation modal

@automated
Scenario: Verify that 6-seat compartments are only available when a Minimum of 4 persons are in cart
    Given I am logged in to reservations2 'uat'
    When I click on 'New Order' button
    When I attempt to create an order selecting '4' adult for when choosing who
    Then The '6-seat compartment' compartments are displayed in the select reservation modal
    Then I close the compartments modal
    When I attempt to create an order selecting '2' adult for when choosing who
    Then The '6-seat compartment' compartments are not displayed in the select reservation modal
    