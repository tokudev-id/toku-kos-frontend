# 🚀 Cloudinary CDN Integration - Quick Start

## What's New?

KTP file uploads now use **Cloudinary CDN** instead of local storage.

✨ Benefits:
- Files stored on global CDN (faster delivery)
- No local disk space needed
- Automatic image optimization
- Easy to extend to other file types

## 5-Minute Setup

### 1. Get Cloudinary Credentials (2 min)

1. Go to https://cloudinary.com/users/register/free
2. Sign up for free account
3. Verify email
4. Go to Dashboard → Settings → API Keys (bottom left)
5. Copy these three values:
   - Cloud Name
   - API Key
   - API Secret

### 2. Update Environment (1 min)

Edit `toku-kos-backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 3. Restart Backend (1 min)

```bash
cd toku-kos-backend
npm run start:dev
```

### 4. Test It (1 min)

1. Go to Admin → Daftar Penghuni
2. Click dropdown on any resident
3. Click "Upload KTP"
4. Select an image
5. ✅ Done!

## Files Uploaded

Where do files go? → **Cloudinary Cloud** (not your server)

### Folder Organization:
```
toku-kos/
└── residents/
    └── ktp/           ← KTP files stored here
```

Access files at: https://cloudinary.com (Dashboard → Media Library)

## Reuse for Other Uploads

The same module can be used for:

- 📷 Property photos
- 📸 Maintenance images  
- 💰 Payment proofs
- 📄 Documents

**How?** See `CLOUDINARY_INTEGRATION.md` in backend root

## Common Questions

### Q: Is it free?
**A:** Yes! Cloudinary free plan includes:
- 5GB storage
- 5GB bandwidth per month
- 25,000 transformations/month

### Q: How do I view uploaded files?
**A:** 
- Backend: Dashboard → Media Library (or API)
- Frontend: Click "Lihat KTP" button to view

### Q: Can I download files?
**A:** Yes! Click "Unduh" button in the KTP modal

### Q: What if I forget Cloudinary credentials?
**A:** Backend won't start. Copy credentials again to `.env`

### Q: File upload is slow?
**A:** 
- Check internet speed (Cloudinary is fast)
- File may be too large (reduce size)
- Cloudinary servers may be busy (retry)

### Q: Where's my local uploads folder?
**A:** No longer used! Files go to Cloudinary instead

## Troubleshooting

### ❌ Error: "CLOUDINARY credentials not set"
→ Check `.env` file has all three variables

### ❌ Upload stops halfway
→ File too large (max 5MB free tier) or network issue

### ❌ Backend won't start
→ Run `npm install` to ensure packages installed

### ❌ File not showing in modal
→ Check browser console (F12) for errors

## Module Architecture

```
Your Feature
    ↓
FileInterceptor (capture file)
    ↓
Your Service (business logic)
    ↓
FileUploadService (reusable!)
    ↓
Cloudinary API
    ↓
CDN URL stored in database
```

## What Changed?

### Before (Local Storage)
```
Upload → Save to ./uploads/ktp/ → Serve from localhost:3000
```

### Now (Cloudinary CDN)
```
Upload → Cloudinary → Returns secure URL → Store in DB
```

## Next Steps

1. ✅ Setup Cloudinary account
2. ✅ Update `.env`
3. ✅ Restart backend
4. ✅ Test KTP upload
5. 📖 Read `CLOUDINARY_INTEGRATION.md` for adding to other features

## Documents to Read

| Doc | Purpose |
|---|---|
| `FILE_UPLOAD_README.md` | API reference & examples |
| `CLOUDINARY_INTEGRATION.md` | How to add to other features |
| `KTP_CLOUDINARY_IMPLEMENTATION.md` | Full technical details |

## Support

**Need help?**

1. Check troubleshooting above
2. Read documentation in backend root
3. Check Cloudinary docs: https://cloudinary.com/documentation

---

**That's it!** You now have enterprise-grade CDN file uploads. 🎉
