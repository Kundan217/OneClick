# Deployment Guide for OneClick

I have prepared your code for deployment! Both your frontend and backend are now ready to be hosted for free. 

Follow these steps exactly to get your app live on the internet with a real `https://` domain for Tidio.

---

## Step 1: Push your code to GitHub
If you haven't already, push this code to a public or private GitHub repository. Both Render and Vercel will deploy automatically from your GitHub.

---

## Step 2: Set up the Database (MongoDB Atlas)
Since you are currently using an "in-memory" database (data deletes on restart), you need a real one for production.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Build a **Free Cluster (M0)**.
3. In **Database Access**, create a user (set a username and password). *Save this password!*
4. In **Network Access**, click "Add IP Address" and select **"Allow Access from Anywhere"** (`0.0.0.0/0`).
5. Go back to Databases, click **Connect** -> **Drivers** -> **Node.js**.
6. Copy the **Connection String** (it will look like `mongodb+srv://<username>:<password>@cluster0...`).
7. Replace `<password>` in the string with the password you just made. Keep this string ready for Step 3.

---

## Step 3: Deploy the Backend (Render)
1. Go to [Render.com](https://dashboard.render.com/register) and sign up with GitHub.
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically read the `render.yaml` file I just created and set up your backend!
5. When prompted for Environment Variables in the Render dashboard, you **MUST** provide:
   - `MONGO_URI`: The connection string from Step 2.
   - `GEMINI_API_KEY`: Your Gemini AI key.
6. Click **Apply**.
7. Wait for the deploy to finish. Once it says "Live", copy the Render URL (e.g., `https://oneclick-backend.onrender.com`).

---

## Step 4: Deploy the Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com/signup) and sign up with GitHub.
2. Click **Add New Project** and import your GitHub repository.
3. In the "Framework Preset", it should auto-detect **Vite**.
4. Set the **Root Directory** to `frontend`.
5. Open **Environment Variables** and add:
   - Name: `VITE_API_URL`
   - Value: The Render URL you copied in Step 3 (e.g., `https://oneclick-backend.onrender.com`).
6. Click **Deploy**!

---

Once Vercel finishes, click your live URL. Your Tidio bot will now work perfectly on your live, secure HTTPS website!
