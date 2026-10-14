# Code review

Reviewed the starter as it runs today: the Express API on port 3000, and the Next.js app. The task dashboard is in decent shape. The activity log, on both sides, is where most of the problems are. I have not changed behavior in this commit. The notes below are what I would raise before refactoring.

## Backend

### Bugs

**1- Task validation is split across three places, and the rules do not match.**

-  `taskValidator.js` already checks the body shape, rejects unknown fields, trims the title, and defaults `completed` to false. Nothing imports it. `tasks.controller.js` repeats those checks, and `tasks.service.js` repeats them again. Create accepts any non-empty title. Update rejects a title shorter than 2 characters inside `updateTask`. A one-character title can be created, then cannot be saved again.

 - This matters because the next person will fix one copy and leave the others behind, and clients already see different errors for the same field (`title cannot be empty`, `Invalid title.`, `Title is too short.`).

 - I would call `validateCreateTask` and `validateUpdateTask` from the controller, pass only the returned object into the service, and move the "at least 2 characters" rule into the validator so update keeps today's behavior. The service should only read and write the file and throw when the id is missing.



 **2- PATCH copies the whole body onto the stored task.**

- `patchTask` passes `req.body` through, and `updateTask` does `{ ...existingTask, ...updates }`. A client can send `id` or `createdAt` and overwrite them. Extra keys are stored too. `updatedAt` happens to survive because the service sets it after the spread.

-  This matters because the id is the only key the dashboard and `GET /tasks/:id` use. Changing it makes the task unreachable.

- The validator already has an allow-list of `title` and `completed`. Using that result, and nothing else, closes the hole. I would keep the public task shape as it is: `id`, `title`, `completed`, `createdAt`, `updatedAt`.


**3- Create mutates the request body.** When `completed` is omitted, `createTask` assigns `payload.completed = false` on 

- the object Express parsed. The controller does the same thing earlier. This matters because the controller and the service now share one object, and a later log or middleware would see a field the client never sent. The validator should return a new object. The service should store that object and leave `req.body` alone.


**4-Activity ids can collide, and the two loaders are the same function.** 

`activity.service.js` sets `id` to `String(Date.now())`. Two creates in the same millisecond write the same id, and the feed then renders two rows with one React key. `loadDataA` and `loadDataB` are copies.  `getAllActivity` uses one and `createNewActivity` uses the other, so a fix in one path can miss the other.

 -  Tasks already use `createId()` from `utils/id.js`. Activity should use that too, and there should be one read function.

 **5- A corrupt activity file is handled differently from a corrupt task file, and a non-array file is treated as empty.** 

-  Activity uses `JSON.parse` on the raw file. Invalid JSON throws. `readJsonArray`, which tasks use, has a second problem: if the file parses but the value is not an array, it returns `[]`. The next create then writes that empty list plus the new row, and the previous records are gone. 

-  I would make `readJsonArray` throw on a non-array, and point activity at that helper so both modules fail loudly instead of wiping data. I would also write to a temp file in the same directory and rename it over the target, so a crash mid-write does not leave a half-written JSON file. I would not add a lock or a database. The brief says the JSON files stay.

### Performance

- **The activity service blocks the process on every request.** `loadDataA`, `loadDataB`, and `createNewActivity` use `existsSync`, `readFileSync`, and `writeFileSync`. Tasks already use the async helpers in `jsonStore.js`. One slow disk read stalls every other request on the server.
I would delete the sync helpers and use `readJsonArray` and `writeJsonArray`. The response shapes stay the same.
Reading the whole file on each call is fine at this size. I would not add a cache. Two processes would go stale, and the data is a JSON file on purpose.

### Security



- **Activity input is not validated.** `POST /activity` stores `action` and `info` exactly as they arrive. The endpoint doc says this. A non-string, or a very large string, is written into `activity.json`. The task routes at least check types.
I would accept only strings, trim them, cap each at 200 characters, and reject a body where both are empty. `GET /activity` should still return a raw array, and `POST /activity` should still return the created object with 201. The dashboard depends on those shapes.
**The JSON body parser has no size limit.**
`express.json()` is registered with the default limit. A large body is wasted work before validation runs.
I would set a small limit, around 16kb. These payloads are a title and two short strings.
There is no authentication. I am leaving that. The app is a local JSON API, and the browser already talks to the Next.js route handlers rather than to Express directly.

### Maintainability



**1- The activity module does not use the error path the task module uses.** 

-  Task routes wrap controllers with `asyncHandler`, and failures become `{ error: { message } }` through `errorHandler.js`. Activity routes call `get_activity` and `addActivity` directly. A thrown error there does not follow the same path. Names in that module (`loadDataA`, `fp`, `get_activity`, `b`) also make the flow harder to follow than the task module. 

- I would wrap the activity routes with `asyncHandler`, throw `HttpError` for bad input, and rename the handlers to the same style as the task controllers.

 **2- The documented base URL does not match the server.** `backend/src/server.js` listens on port 3000. 

`frontend/docs/backend-endpoints.md` says `http://localhost:4000`. `frontend/lib/constants.ts` falls back to port 4000 when `NEXT_PUBLIC_BACKEND_API_URL` is missing. `.env.example` and the README say 3000. Next.js also defaults to port 3000, so `npm start` and `npm run dev` cannot both bind the same port.
I would keep the API on 3000, point the docs and the fallback at 3000, and run the Next.js app on 3001.



### Code quality



**Error messages for the same failure are inconsistent.**
Create returns `title is required and must be string`. Update returns `bad body type`, `title should be string`, `nothing to update`, and `completed should be bool`. The service then returns a third set of messages. Clients cannot branch on a stable message, and the error handler's shape is the only consistent part.
One validator should own the messages. I would keep them short and specific, and I would not change the status codes: 400 for a bad body, 404 for a missing task, 204 for delete.

## Frontend



### Bugs

**1- A failed task save hides the list.** 

`TaskDashboard` renders `TaskList` only when `!loading && !error`. `useTasks` stores the load failure and the toggle failure in the same `error` string. After a failed PATCH, the tasks unmount and only the error card remains. The user has to guess that Retry will bring the list back.


I would split `loadError` and `actionError`. A failed toggle shows the message above the list and leaves the rows on screen. The first load still replaces the list with the loading and error states, which is the right behavior when there is nothing to show yet.

 **2- The activity page treats every failure as an empty feed.** 

The fetch in `app/activity/page.tsx` does not check `response.ok`. On a network error it clears `allActivity`, `shownActivity`, and `forcedList`. On a 500, `response.json()` can be `{ error: { message } }`, which is truthy, so that object is stored as the list. The next `.filter` then throws.


I would check `response.ok`, read `error.message` when the body has one, and keep a real error state with a Retry button. An empty search result should be a separate empty state, not the same UI as a failed request.

  
3- **The task update proxy turns every backend failure into a 500.**  
`app/api/tasks/[id]/route.ts` catches errors from `updateTaskInBackend` and always responds with status 500. A missing task is a 404 on Express, and a bad `completed` value is a 400. The dashboard can only show whatever message survived, and it cannot tell a validation error from the API being down.  


I would pass the backend status through for 400 and 404. Success stays 200 with `{ data: task }`.

  
4- **The same activity time is rendered twice.**  
`formatTimeA` and `formatTimeB` both call `toLocaleString`, and the row prints both. `applyFilterA` and `applyFilterB` do the same search, one with `includes` and one with `indexOf`, and both run on every update.  


I would keep one formatter and one filter.

### Performance



**The activity feed rerenders on a timer.** 

- An interval every 1400ms increments `tick`. That retriggers the filter effect, which writes `shownActivity`, which retriggers another effect that clones the list into `forcedList`. `stats.everySecondTick` is computed and never shown. Nothing about the data has changed. 

- I would delete the interval, `tick`, and `forcedList`. The visible list should be a `useMemo` of `allActivity` and the query. Fetch once on mount, and again only when the user retries.



### UX issues

**1- The activity search box has no name, and there is no loading state.**

 The input only has a placeholder. While the request is in flight, the page shows an empty list and "Total: 0". That looks like there is no activity. 

 I would add a `<label>`, show a loading line until the request finishes, and show "No activity matches this search" when the filter excludes every row.


**2- Each page is a dead end except for a Back link.** Tasks and Activity each render their own Back link to `/`. There is no shared navigation. Reports does not exist yet, so this is also the place it has to be added.


I would put Tasks, Activity, and later Reports in the root layout, and mark the active page.



### React best practices

**1- The activity page keeps derived data in state.** 

`shownActivity` and `forcedList` are calculated from `allActivity` and `query`, then stored again. The effects depend on `tick`, so the derived state is also refreshed for no reason. The filter functions are recreated on every render inside the page component.


I would keep server data in one state value and derive the filtered list during render. The page component should load the hook and render. Row markup can move to a small `ActivityItem`, which is the split `TaskDashboard` and `TaskItem` already use.


2- `requestJson` **catches the error it just threw.**  
In `useTasks`, a non-OK response parses the body and throws `Error`. The `catch` around that parse catches that same error and wraps it again. The message usually survives, but a JSON parse failure is reported as the parse error instead of the HTTP status.  


I would parse in an inner try, and if parsing fails, throw `Request failed with ${status}`. The intentional `Error` should reach the caller without being caught in that same block.



### Code quality

**Layout styles are inline on every card.**
The dashboard, the task row, the filter, and the activity page set padding, flex, and color through `style`. `globals.css` already has `.card`, `.button`, `.badge`, `.input`, and `.stack`. Changing the spacing means editing each component.


I would move those rules into classes and keep the existing teal palette. The visual pass can happen after the behavior fixes, without another rewrite of the components.

### Maintainability

**1- The activity page is the only module that fetches in the component.** 



Tasks go through `useTasks`, then `app/api/tasks`, then `lib/backendApi.ts`. Activity fetches `/api/activity` directly in the page and ignores the helper style used everywhere else. Reports will need a third copy of the same loading, error, and reload behavior.


I would add `useActivity` with the same shape as `useTasks`: data, a loading flag, an error string, and a reload function. The reports page should use that same shape later, with its own hook, rather than a new pattern.



