# React Data Virtualization & Pagination

Suppose you have a list with 60k products in your database and you want to display them to user. Basically you have 3 options
* Display all them in once using some plugin like [datatables](https://datatables.net/)
* Build complex logic with pagination in your backend server and request new page on user interactions
* Use new technology called virtualization

Let's consider all of them in more details

### Render-all

This option is good for small number of records. Usually up to 5k. Technically you can load 10, 20 or even 30k into browser, but in practice browser will work very slow, when
you attempt to render more than 5k rows, so it's not a good user experience.

pros: everything works in a client, no need to make a load of ajax request to server
cons: works very slow with large number of records, freeze browser

### Pagination

Suppose you have 60k products and want to display them to user. You can build complex pagination system on your backend and load 1k on frontend. Play with it, when you need to
get 1001 item, you make another request to your backend and get the payload of another 1k records.

pros: works fast in a browser
cons: have to make a lot of ajax requests to get data, search items, filter and so on

### Virtualization

The idea of virtualization is pretty simple. You load into js all data at once. But display only part of it. So your browser will not freeze, and at the same time you don't
need to make a lot of additional ajax requests to web-server.
There are 2 ways you can use virtualization
* Pagination
* Scrolling

Scrolling is a little bit difficult, because you have to calculate height every time you scroll. But internally they work the same.