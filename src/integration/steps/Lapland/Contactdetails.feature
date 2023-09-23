Feature: Feature name
    Lapland Contact details

    @automating-lapland
    Scenario: Contact details select parental rights
        Given I am on the details page
        Then I should be able to input the child's first name in the detail field
        And I should be able to enter the child’s details for up to 7 children (matching the amount in the booking)
        And I should be able to select if the child has visited before
        And I should be able to select that I have parental rights over the child

    @automating-lapland
    Scenario: Unsuccessfully enter two children's first names per one child detail field

        Given I am on the details page
        Then I should be able to input a child's first name in the detail field
        And I should not be able to enter more child’s names in details field

    @automating-lapland
    Scenario: As a customer I can successfully enter the main booker details

        Given I am on the details page
        Then I should be able to input the adult details - Main Booker
        And I should be able to enter the child's details for all the children on the booking
        And I can input details in the shipping address section
        And I can input details in the billing address section

