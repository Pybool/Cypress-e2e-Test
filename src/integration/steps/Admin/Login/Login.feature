Feature: Admin regression testing
As a user I want to handle a simplified capacity plan

@automated @admin
Scenario: On Admin login page
    Given I set up the base URL
    Given I am an admin user on Admin web application
    When I go to the main page
    Then title should be 'Building Block'