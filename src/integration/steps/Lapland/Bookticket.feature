Feature: Feature name
    Lapland Booking Ticket

    @automated @lapland @lapland-bookticket
    Scenario Outline: On Lapland As a customer I can successfully create a booking with minimum number of one Adult And one child
        Given I am on Booking Page
        When I input "<Your Party>" data
        When 'Next' button is clicked
        Then 'Your Party' is populated with selected option

        Examples:
            | Your Party                                           |
            | 1x Adult, 1x Child                                   |
            | 1x Adult, 1x Child, 1x Infant, 1x Personal Assistant |
            | 1x Adult, 1x Child, 1x Infant                        |
            | 1x Adult, 1x Child, 1x Personal Assistant            |



    @automated @lapland @lapland-bookticket
    Scenario Outline: On Lapland Unsuccessfully create a booking with minimum number of adult and no child
        Given I am on Booking Page
        When I input "<Your Party>" data
        Then 'Next' button is not active

        Examples:
            | Your Party |
            | 1x Adult   |

    @automated @lapland @lapland-bookticket
    Scenario Outline: On Lapland Unsuccessfully create a booking with minimum number of child and no child
        Given I am on Booking Page
        When I input "<Your Party>" data
        Then 'Next' button is not active

        Examples:
            | Your Party |
            | 1x Child   |


    @automated @lapland @lapland-bookticket
    Scenario Outline: On Lapland Unsuccessfully create a booking with only an infant

        Given I am on Booking Page
        When I input "<Your Party>" data
        Then 'Next' button is not active
        And I am not able to select 'Personal Assistant'

        Examples:
            | Your Party            |
            | 1x Personal Assistant |


    @automated @lapland @lapland-bookticket
    Scenario Outline: On Lapland As a customer I can successfully create a booking with a Personal Assistant and 1 child

        Given I am on Booking Page
        When I input "<Your Party>" data
        And I am not able to select 'Personal Assistant'
        When 'Next' button is clicked
        Then "<Your Party>" is populated with selected option
        When I input '<Your tour>' data for tour
        When I input time "<Select Time>" data for tour
        Then 'Cart' Summary displays with time "<Time>" and date "<Your tour>"

        Examples:
            | Your Party                      | Your tour | Select Time |
            | 1x Child, 1x Personal Assistant | 15 Nov    | 12:00       |

    @automated @lapland @lapland-bookticket
    Scenario Outline: On Lapland Unsuccessfully create a booking with 4 adults and 6 children

        Given I am on Booking Page
        When I input "<Your Party>" data for multiple
        Then Child count should remain 4

        Examples:
            | Your Party         |
            | 4x Adult, 6x Child |

    @automated @lapland @lapland-bookticket
    Scenario Outline: On Lapland Unsuccessfully select unavailable Date and Price

        Given I am on Booking Page
        When I input "<Your Party>" data
        When 'Next' button is clicked
        When I input '<Your tour>' data for tour with "<Select Date>"
        Then I am not able to select the greyed out date

        Examples:
            | Your Party         | Select Date     |
            | 1x Adult, 1x Child | Current Date -1 |


    @automated @lapland @lapland-bookticket
    Scenario Outline: On Lapland Book tickets As a customer I can successfully select available Date and Price

        Given I am on Booking Page
        When I input "<Your Party>" data
        When 'Next' button is clicked
        Then "<Your Party>" is populated with selected option
        When I input '<Your tour>' data for tour
        When I input time "<Select Time>" data for tour
        Then 'Cart' Summary displays with time "<Time>" and date "<Your tour>"
        # And I can see the timer running

        Examples:
            | Your Party         | Your tour | Select Time |
            | 1x Adult, 1x Child | 18 Nov    | 09:30       |
