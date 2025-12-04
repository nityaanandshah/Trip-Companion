# Cloudinary Setup Guide

Cloudinary is used for storing and optimizing user avatars and trip images.

## 1. Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a **free account** (no credit card required)
3. You get:
   - 25GB storage
   - 25GB monthly bandwidth
   - Image transformations and optimization

## 2. Get Your API Credentials

After signing up:

1. Go to your **Dashboard** (https://console.cloudinary.com/)
2. You'll see your credentials:
   - **Cloud Name** (e.g., `dxxxxxxxxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

## 3. Add to Environment Variables

Add these to your `.env` and `.env.local` files:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Important Notes:**
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` has the `NEXT_PUBLIC_` prefix (accessible in browser)
- `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` do NOT have the prefix (server-only)
- Replace the values with your actual credentials from the dashboard

## 4. Restart Your Dev Server

After adding the environment variables:

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

## 5. Test Avatar Upload

1. Go to http://localhost:3000/profile/edit
2. Click "Change Avatar"
3. Select an image
4. If configured correctly, it will upload to Cloudinary!

## Folder Structure in Cloudinary

Images are organized as:
- **Avatars**: `trip-companion/avatars/`
- **Trip Images**: `trip-companion/trips/` (coming in Week 2)

## Troubleshooting

### "Image upload not configured" error
- Check that all three environment variables are set in `.env` and `.env.local`
- Make sure to restart the dev server after adding variables

### Upload fails silently
- Check browser console for errors
- Verify API credentials are correct
- Make sure your Cloudinary account is active

### Image doesn't display
- Cloudinary URLs are HTTPS - make sure avatarUrl is saved correctly
- Check the Cloudinary dashboard to see if the image was uploaded

## Optional: Configure Upload Presets (Advanced)

For more control, you can create upload presets in Cloudinary:

1. Go to **Settings** → **Upload**
2. Scroll to **Upload presets**
3. Create a new preset for avatars with:
   - Folder: `trip-companion/avatars`
   - Transformations: 400x400 crop, quality auto
   - Allowed formats: jpg, png, webp

## Free Tier Limits

The free tier includes:
- ✅ 25GB storage
- ✅ 25GB bandwidth/month
- ✅ Up to 25 credits/month for transformations
- ✅ Plenty for an MVP with dozens of users!

---

**Next Steps**: Once Cloudinary is configured, you can:
1. Upload your profile avatar
2. Edit your bio and profile information
3. Move on to Week 2: Trip Creation

