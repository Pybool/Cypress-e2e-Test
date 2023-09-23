Feature: Admin regression testing
    As a user I want to handle a simplified capacity plan

    @automating @admin-capacity
    Scenario: On Admin login page
        Given I set up the base URL
        Given I logged as an admin user on Admin web application
        When I go to the main page
        When I go to the side menu option 'Venues' page
        When I add a new venue
        Then I create and save a new venue
        Then I edit the last created venue
        Then I select the tab capacity plan
        Then I create a new capacity plan
        Then I set title to my new capacity plan
        Then I select 'numbered' capacity plan
        Then I add and set capacity options of a 'numbered' plan