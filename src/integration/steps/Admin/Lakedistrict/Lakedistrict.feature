Feature: Admin regression page load
    As a User I want to click pages So all main menu loads

    @automated @lakedistrict-admin  @lakedistrict-admin-nav
    Scenario Outline: On LakedistrictAdmin Tab Menus in User Administration page is searchable
        Given I am a user on Admin Page
        When I click User Admin on the Nav bar
        Then I click a "<User Admin>" tab on 'User Admin' page
        And I type "<Search phrase>" in search box
        Then Search returns result containing '<Search phrase>'

        Examples:
            | User Admin         | Search phrase |
            | All users          | Tayé          |
            | Admin users        | Tayé          |
            | POS users          | Beccy         |
            | Reservations users | Tayé          |
            | Scanning app users | Olamide       |
