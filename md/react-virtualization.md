# React Data Virtualization & Pagination

Suppose you have a list with 60k products in your database and you want to display them to user. Basically you have 2 options
* Display all them in once using some plugin like [datatables](https://datatables.net/)
* Build complex logic with pagination in your backend server and request new page on user interactions

Let's consider them in more details

### All-in-Once

This option is good for small number of records. Usually up to 5k. Technically you can load 10, 20 or even 30k into browser, but in browser