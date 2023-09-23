Feature: Feature name
    Lapland Payment details

    @automating-lapland
    Scenario: As a customer I can successfully enter payment details

        Given I am on the payment page
        Then I can input my name
        And I can input the card number- no space between card numbers
        And I can input the expiry date
        And I can input the cvc
        And I click on Complete payment

    @automating-lapland
    Scenario: Unsuccessfully enter payment details

        Given I am on the payment page
        When I do not enter any details
        And I click Complete payment
        Then an error message is displayed for all the required fields
