Feature: Add Product and Services
    As a User I want to visit admin page So I can add products

    @automated @lakedistrict-admin @products
    Scenario Outline: On LakedistrictAdmin User should be able to add items
        Given I am a user on Admin Page for 'lakedistrict'
        When I click on the "<menu>" menu link
        And I click the "<add>" button
        And I enter a "<Name>", "<External ID>" and enter other relevant details for "<menu>" menu and "<submenu>"
        And I click the Save button The record should have been created on post request to "<URL>"

        Examples:
            | menu       | submenu         | add                      | Name                         | External ID                  | URL                    |
            | Services   |                 | Add a new service        | Testing Taye Service         | testing_taye_service         | /admin/services        |
            | Combos     |                 | Add a new combo          | Testing Taye Combo           | testing_taye_combo           | /admin/combos          |
            | Promos     |                 | Add a new promotion      | Testing Taye Promotion       | testing_taye_promotion       | /admin/promotions      |
            | Extras     | add-ons         | Create a New Add-on      | Testing Taye Add-on          | testing_taye_Add-on          | /admin/addons          |
            | Extras     | recommendations | Add a new recommendation | Testing Taye Recommendations | testing_taye_recommendations | /admin/recommendations |
            | User Admin |                 | Add a new user           | Testing Taye User            | testing_taye_user            | /admin/users/profiles  |

    @automated @lakedistrict-admin @products
    Scenario Outline: On LakedistrictAdmin User should be able to download Reports
        Given I am a user on Admin Page for 'lakedistrict'
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
