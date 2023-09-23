Feature: Book Magical/Other extras

    As a user I want to visit Lapland website So I can book magical/extras ticket

    @automated @lapland @lapland-extras
    Scenario Outline: On Lapland User can purchase one extra invitation boxes

        Given I am on Booking Page
        When I input "<Your Party>" data
        When 'Next' button is clicked
        When I input '<Your tour>' data for tour for extras
        When I input time "<Select time>" data for tour
        Then 'Cart' Summary displays with time "<Time>" and date "<Your tour>"
        When I am on the extra page
        When I click + button '1' times in 'Additional Invitation Box'
        Then the price in 'Additional Invitation Box' booking is updated by '£5.00'
        And the price for 'Additional Invitation Box' is added to the Booking Summary

        Examples:
            | Your Party         | Your tour | Select time |
            | 1x Adult, 1x Child | 18 Nov    | 09:30       |


    @automated @lapland @lapland-extras
    Scenario Outline: On Lapland User can purchase seven extra invitation boxes
        Given I am on Booking Page
        When I input "<Your Party>" data
        When 'Next' button is clicked
        When I input '<Your tour>' data for tour for extras
        When I input time "<Select time>" data for tour
        Then 'Cart' Summary displays with time "<Time>" and date "<Your tour>"
        When I am on the extra page
        When I click + button '7' times in 'Additional Invitation Box'
        Then the price in 'Additional Invitation Box' booking is updated by '£35.00'
        And the price for 'Additional Invitation Box' is added to the Booking Summary

        Examples:
            | Your Party         | Your tour | Select time |
            | 1x Adult, 1x Child | 18 Nov    | 09:30       |

    @automated @lapland @lapland-extras
    Scenario Outline: On Lapland User should see extra packaging and postage fee when adding invitation boxes

        Given I am on Booking Page
        When I input "<Your Party>" data
        When 'Next' button is clicked
        When I input '<Your tour>' data for tour for extras
        When I input time "<Select time>" data for tour
        Then 'Cart' Summary displays with time "<Time>" and date "<Your tour>"
        When I am on the extra page
        When I click + button '1' times in 'Additional Invitation Box'
        Then the packaging and postage fee is updated
        And the price for 'Additional Invitation Box' is added to the Booking Summary

        Examples:
            | Your Party         | Your tour | Select time |
            | 1x Adult, 1x Child | 18 Nov    | 09:30       |

    @automated @lapland @lapland-extras
    Scenario Outline: On Lapland User should be able to purchase Elf Jingles in increments of £30
        Given I am on Booking Page
        When I input "<Your Party>" data
        When 'Next' button is clicked
        When I input '<Your tour>' data for tour for extras
        When I input time "<Select time>" data for tour
        Then 'Cart' Summary displays with time "<Time>" and date "<Your tour>"
        When I am on the extra page
        When I click + button '1' times in 'Elf Jingles'
        Then the price in 'Elf Jingles' booking is updated by '£30.00'
        And the price for 'x Jingles' is added to the Booking Summary

        Examples:
            | Your Party         | Your tour | Select time |
            | 1x Adult, 1x Child | 18 Nov    | 09:30       |

    @automated @lapland @lapland-extras
    Scenario Outline: On Lapland User can purchase cancellation protection
        Given I am on Booking Page
        When I input "<Your Party>" data
        When 'Next' button is clicked
        When I input '<Your tour>' data for tour for extras
        When I input time "<Select time>" data for tour
        Then 'Cart' Summary displays with time "<Time>" and date "<Your tour>"
        When I am on the extra page
        When I click + button '1' times in 'Elf Jingles'
        And I click 'Add' in Cancellation Protection screen
        Then a cancellation protection is added to the booking
        And the price in booking is updated with '£9.90' for cancellation
        And 'Continue booking' button is clickable

        Examples:
            | Your Party         | Your tour | Select time |
            | 1x Adult, 1x Child | 18 Nov    | 09:30       |


    # Scenario Outline: On Lapland User should be able to remove cancellation protection
    #     GIVEN I am on the extra page
    #     WHEN I input <Your Party>, <Your tour>, <Select time> data
    #     AND ‘Your Party’, Your tour’ and ‘Select time’ is populated within Booking Summary
    #     WHEN I click ‘+’ button once in ‘Elf Jingles’
    #     AND I click ‘Add’ in Cancellation Protection screen
    #     AND Booking summary reflects the total amount with cancellation protection
    #     WHEN I click 'Remove'
    #     THEN the cancellation protection is removed from the booking
    #     THEN Booking summary reflects the total amount without cancellation protection
    #     AND ‘Continue booking’ button is clickable

    #     Examples:
    #         | Your Party         | Your tour | Select time |
    #         | 1x Adult, 1x Child | 18 Nov    | 09:30       |

    # Scenario Outline: On Lapland ‘You haven't purchased Cancellation Protection yet’ modal should display
    #     GIVEN I am on the extra page
    #     WHEN I input <Your Party>, <Your tour>, <Select time> data
    #     AND ‘Your Party’, Your tour’ and ‘Select time’ is populated within Booking Summary
    #     WHEN I click ‘+’ button once in ‘Elf Jingles’
    #     AND I click ‘Continue’ in Cancellation Protection screen
    #     THEN a pop-up is displayed
    #     AND I can select ‘No, I do not wish to purchase Cancellation Protection’
    #     AND I click ‘Continue
    #     THEN the cancellation protection is not added to my booking summary
    #     AND I am on the Contact Details page

    #     Examples:
    #         | Your Party         | Your tour | Select time   |
    #         | 1x Adult, 1x Child | 18 Nov    | Morning 09:30 |



