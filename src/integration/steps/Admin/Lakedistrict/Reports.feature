 Feature: Add Product and Services
    As a User I want to validate reports page

 @automated @lakedistrict-admin @products
    Scenario: Validate the Sales Report page for "Markets and channels" section
        Given I am a user on Admin Page
        And I am a user on Report page
        When I click a 'Sales report' on 'Reports' page
        Then I should see a header with text "Sales report"
        And I should see a section "Markets and channels"
        And Under "Markets and channels" I should see "Filter markets" "Filter channels" and "Filter sources" dropdowns
        Then I select all for "Filter markets" "Filter channels" and "Filter sources" dropdowns for "Markets and channels"
        Then I should see pills matching the contents of what is in the dropdown for "Markets and channels"
        When I click the "-" icon on any pill
        Then The pill should disappear
        When I click on the "-" icon on any dropdown
        Then All pills for that dropdown should disappear

 @automated @lakedistrict-admin @products
    Scenario: Validate the Sales Report page for "Products and services" section
        Given I am a user on Admin Page
        And I am a user on Report page
        When I click a 'Sales report' on 'Reports' page
        Then I should see a header with text "Sales report"
        And I should see a section "Products and services"
        And Under "Products and services" I should see "Filter products" "Filter services" and "Filter service type" dropdowns
        Then I select all for "Filter products" "Filter services" and "Filter service type" dropdowns for "Products and services"
        Then I should see pills matching the contents of what is in the dropdown for "Products and services"
        When I click the "-" icon on any pill
        Then The pill should disappear
        When I click on the "-" icon on any dropdown
        Then All pills for that dropdown should disappear


    @automated @lakedistrict-admin @products
    Scenario Outline: On LakedistrictAdmin User should be able to download Reports
        Given I am a user on Admin Page
        And I am a user on Report page
        When I click a '<Report menu>' on 'Reports' page
        And I click "<Download>" report
        Then The "<Download>" is downloaded

        Examples:
            | Report menu                    | Download                        |
            | Sales report                   | Sales Report                    |
            | Functions manifest             | Manifest Report                 |
            | Yield report                   | Yield Report                    |
            | External Orders report         | External Orders Report          |
            | Payments summary report        | Payments Report                 |
            | Newsletter subscription report | Newsletter Subscriptions Report |