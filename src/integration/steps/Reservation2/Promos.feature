Feature: Admin regression page load
As a User I want to click pages So all main menu loads

@automated @rs2
Scenario Outline: On LakedistrictAdmin Services Products and Combos Loads
    Given I am logged in to reservations2 'test'
    When I click on 'New Order' button
    Then I select the '<market>' to operate on
    Then I attempt to create an order selecting '<adults>' adult and '<children>' child for when choosing who
    Then I ensure that a '<discount>' discount is applied on 'Child'
    Examples:
        | adults        | children	| discount| market |
        | 2		| 3 | 10%	| SA     |
 


@automates
Scenario Outline: On LakedistrictAdmin Services Products and Combos Loads
    Given I am logged in to reservations2 'test'
    When I click on 'New Order' button
    Then I select the '<market>' to operate on
    Then I attempt to create an order selecting '<adults>' adult and '<children>' child for when choosing who
    Then I ensure that a '<discount>' discount is applied on 'Child'
    Examples:
        | adults        | children	| discount| market |
        | 2		| 3 | 5%	| SA     |
        