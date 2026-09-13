# Andhra Foodie Cage

A mobile-first Andhra food ordering app inspired by the provided reference screens.

## Features

- Welcome screen with chef-in-cage visual
- Demo screen with Login, Sign Up, and guest navigation
- Meals, Sides, and Snacks menu categories
- Dish details with descriptions and prices
- Search dishes
- Add items to basket and update quantities
- Favourite food list
- Delivery contact form
- Payment choices: Pay on delivery, PhonePe, Paytm, and Google Pay
- Order confirmation and delivery tracking screen
- Browser geolocation support for live user coordinates
- Installable PWA for mobile home screens

## Files

- `index.html` - App shell and PWA registration
- `app.js` - Screens, menu data, navigation, cart, checkout, and tracking logic
- `styles.css` - Responsive mobile-first styling
- `manifest.json` - PWA metadata
- `sw.js` - Offline cache service worker
- `icon.svg` - App icon

## Run Locally

No build step is required.

Open `index.html` directly in a browser, or start a local server from this folder:

```powershell
py -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

## Deploy With Netlify

1. Create a new site in Netlify.
2. Choose **Deploy manually**.
3. Upload the complete project folder.
4. Ensure `index.html`, `app.js`, `styles.css`, `manifest.json`, `sw.js`, and `icon.svg` are included.

## Install On Mobile

Open the deployed HTTPS URL on a phone browser and choose **Install app** or **Add to Home screen** from the browser menu.

## Live Location Note

The tracking screen uses the browser Geolocation API and requires the user to allow location permission. Actual delivery-partner tracking requires a backend service and a separate delivery-partner location source.
