Feature: Admin regression testing
    As a user I want to test several capacity variations

    # @automated @reservation2
    # Scenario Outline: On Ravenglass new booking should capacity options be display accordingly
    #     Given I set up the base URL
    #     Given I login as an admin user on Reservations 2 web application
    #     Given A previous set db dump and capacity allocation fixture
    #     When I go to New Order > Capacity Allocation page
    #     When I click on ticket selection button
    #     And I select '<Attendees qty>' tickets of '<Attendees>'
    #     And I select a date time and add to the cart
    #     Then Should '<Available options>' be the only displayed options

    #     Examples:
    #         | From               | To                | Attendees        | Attendees qty | Available options                          |
    #         | Ravenglass station | Delegarth station | ravenglass-adult | 1             | No_140_First_Class_1, Carriage_C_Seats_1-2 |
    #         | Ravenglass station | Delegarth station | ravenglass-adult | 2             | No_140_First_Class_1, Carriage_C_Seats_1-2 |
    #         | Ravenglass station | Delegarth station | ravenglass-adult | 3             | No_140_First_Class_1, Carriage_C_Seats_3-6 |
    #         | Ravenglass station | Delegarth station | ravenglass-adult | 4             | No_140_First_Class_1, Carriage_C_Seats_3-6 |
    #         | Ravenglass station | Delegarth station | ravenglass-adult | 5             | No_140_First_Class_1, Carriage_A_Seats_1-6 |
    #         | Ravenglass station | Delegarth station | ravenglass-adult | 6             | No_140_First_Class_1, Carriage_A_Seats_1-6 |