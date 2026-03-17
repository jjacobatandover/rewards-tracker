# Perks Tracker

A personal credit card benefits tracker for you and a partner. Track which perks and credits you've used across all your cards, sorted by remaining value so you always know what to spend next.

Each person who sets this up runs their own completely private instance — your data never touches anyone else's deployment.

---

## What it does

- Add credit cards from a built-in template library
- Mark benefits as used and track how much value you've redeemed
- Auto-sorts cards by remaining value so the most valuable unused perks are always at the top
- Supports two cardholders (e.g. you and a spouse) with separate tracking per person
- Syncs across devices via your own private database
- Password-protected so only you and your partner can access it

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A free [Vercel](https://vercel.com) account (for hosting)
- A free [Upstash](https://upstash.com) account (for cross-device sync — optional)
- An [Anthropic API key](https://console.anthropic.com) (only needed if you want to refresh card benefits locally)

---

## Setup

### 1. Get the code

Fork or clone this repository to your own GitHub account. Your data will be tied to your own deployment — it is never shared with the original repo or anyone else.

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
npm install
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and create a new project
2. Import your GitHub repository
3. Leave all build settings as defaults — Vercel will detect Next.js automatically
4. Click **Deploy**

### 3. Add cross-device sync (optional but recommended)

This lets you and your partner see the same data from any device.

1. In your Vercel project, go to the **Marketplace** tab
2. Search for **Upstash** and add the **Redis** integration
3. Choose the free tier and connect it to your project
4. Vercel will automatically add the required environment variables

### 4. Set your password

In your Vercel project, go to **Settings > Environment Variables** and add:

| Variable | Value |
|---|---|
| `SITE_PASSWORD` | The password you and your partner will use to log in |
| `AUTH_SECRET` | Any long random string (e.g. `k9xT2mQpW7vLnR4jY8bZ`) — this is used to sign your login cookie and never needs to be typed |

After adding variables, go to **Deployments**, click the three dots on the latest deployment, and select **Redeploy**.

### 5. Open the site

Your site will be live at `YOUR_PROJECT_NAME.vercel.app`. Share the URL and password with your partner.

---

## Running locally (optional)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No password is required locally unless `AUTH_SECRET` is set in a `.env.local` file.

---

## Keeping card benefits up to date

Card benefits change occasionally. You can refresh them locally using the built-in update script, which uses Claude AI to fetch the latest benefit information from each card's official page.

```bash
# Update all cards that haven't been updated in 30+ days
npm run update-benefits

# Update a specific card
npm run update-benefits "Chase Sapphire Reserve"

# Force-update all cards regardless of age
npm run update-benefits -- --all
```

This requires an Anthropic API key. Add it to a `.env.local` file (this file stays on your machine and is never committed):

```
ANTHROPIC_API_KEY=your_key_here
```

After running the script, commit and push the updated `lib/cardData.ts` to redeploy:

```bash
git add lib/cardData.ts
git commit -m "Update card benefits"
git push
```

---

## Customizing cardholder names

Click the gear icon in the top-right corner of the app to rename "Me" and "Spouse" to your actual names. This setting is saved locally per browser.

---

## Privacy

- Your card data is stored in your own Upstash Redis database, which only your Vercel deployment can access
- No data is sent to or shared with anyone else
- The source code contains no card data — only templates used to pre-populate benefits when you add a new card
- Benefit update scripts run entirely on your local machine

---

## Tech stack

- [Next.js](https://nextjs.org/) — React framework
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Upstash Redis](https://upstash.com/) — serverless database for cross-device sync
- [Anthropic Claude](https://anthropic.com/) — optional AI for benefit updates (local only)
- [Vercel](https://vercel.com/) — hosting and deployment
