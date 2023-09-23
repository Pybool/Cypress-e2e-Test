Feature: Capacity Level Management

  @automated @capacity
  Scenario: Adding to Cart and Checking Availability
    Given I am logged in to reservations2 'uat'
    When I click on 'New Order' button
    When I select and input in the following fields:
      | MARKET        | FROM               | TO                 | WHO         | WHEN                 |
      | Ravenglass    | Ravenglass station | Dalegarth station | 40x Adult  | 30 Days from today   |
    And I select the '15:10' option
    When I click 'Add To Cart' button
    And I select the following options from the Cart:
      | Accessibility carriage    |
      | Joan Pullman Observation seat - All , Joan Pullman Observation 4-seat compartment - All , Closed carriage 6-seat compartment - (Carriage A and Carriage B and 1 Carriage E), Closed carriage 4-seat compartment - (Carriage A) |
    And I complete the checkout process
    Then the following options should not be available for purchase:
      | Accessibility carriage    |
      | Joan Pullman Observation seat - All , Joan Pullman Observation 4-seat compartment - All|

  @automated @capacity
  Scenario: Capacity Adjustment
    Given I am logged in to reservations2 'uat'
    And I have an order for 40 Adults with the following seat selection:
      | Accessibility carriage    |
      | Joan Pullman Observation seat - All , Joan Pullman Observation 4-seat compartment - All , Closed carriage 6-seat compartment - (Carriage A and Carriage B and 1 Carriage E) |
    When I reduce the group size to '6' Adults
    And I select the 'Accessible carriage' compartment option
    When I click 'Commit Changes' button
    Then I click the the refund or checkout button
    And I process a refund or checkout
    Then the following options should be available for purchase:
      | Accessibility carriage    |
      | Joan Pullman Observation seat - All , Joan Pullman Observation 4-seat compartment - All , Closed carriage 6-seat compartment - (Carriage A and Carriage B and 1 Carriage E) |

    And The 'Accessible carriage' compartment should not be available