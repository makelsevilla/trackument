# How to Run 

--- 

1. Run npm install & composer install command 
2. Rename .env.example to .env
3. RUN `php artisan key:generate`
4. Create a database named `trackument`
5. RUN `php artisan migrate:fresh --seed`
6. RUN `npm run dev`
7. RUN `php artisan serve`

## Setup realtime Notification via Pusher 

--- 

1. Create pusher account & create a channel
2. Generate pusher app key
3. Copy `app_id`, `key`, `secret`, `cluster` then paste it in .env file  `PUSHER_APP_ID`, `PUSHER_APP_KEY`, `PUSHER_APP_SECRET` and `PUSHER_APP_CLUSTER` respectively.

## Sample user credentials

---

### Admin
username: admin  
password: password

### User
username: accounting-office  
password: password
