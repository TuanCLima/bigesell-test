## Solution Items

### /api/stats
- When calculating the average sum I decided for not doing file watching, which has the inherent limitation of not updating file during its down time (when it's not checking). I thought it was better to update the average when the new item is added and also not recalculate the whole sum, but use the previous value to calculate the new.

### Virtualization and Pagination
- I faced some problems using react-window so I decided to go for Virtuoso.
- The windowing of the items is a good precaution here, but the number of items to be displayed is going to be limited by the page size.
- I decided for doing the paging on the backend. As mentioned on the description for the test, the list might get large. So I thought that distributing the delay over the paging process by the user would be better than getting a big delay on first load.

### Security Issue
- I found the security issue around the "getToken" function implementation. The code is clearly a threat due to unexpected external access of resources and has potential for running external code. I proceeded to commenting and neutralizing its implementation.
- I was not sure whether I should just remove it, so I decided to leave it, so my comments there can be read.

### Testing
- I added a few UT to the backend and frontend parts. I was not sure how comprehensive they should be. 45 minutes of duration was mentioned in the email I received and I was well over that. So I wrote just those ones.

### Development Decisions
- I was debating whether I should update the code with more modern tools like create-tsrouter-app, vite, tailwind and even typescript, but decided not to. I thought it would be outside the scope of the test.


### Other tasks

- ✅ Refactor blocking I/O
- ✅ Fix memory leak
- ✅ Payload validation on post item route
- ✅ Fix data leak issue
- ✅ Make search more comprehensive (search for categories)