# Hostinger Deployment Guide for BK Research Labs

This guide explains how to deploy this React/Vite web application onto Hostinger hosting.

---

## Method 1: Hostinger Shared / Cloud / Business Web Hosting (hPanel)

### Step 1: Export or Download Code
1. In Google AI Studio Build, open the top menu and select **Export** to download the project as a `.ZIP` file (or push to GitHub).
2. Extract the `.zip` archive on your computer.

### Step 2: Build the Production Bundle
1. Open a terminal (PowerShell, Command Prompt, or macOS Terminal) inside the extracted project folder.
2. Run the following commands:
   ```bash
   npm install
   npm run build
   ```
3. A folder named **`dist`** will be generated. This folder contains all the static HTML, JavaScript, CSS, Favicon, and the pre-configured `.htaccess` file.

### Step 3: Upload to Hostinger File Manager
1. Log in to your **Hostinger Account** (hPanel).
2. Go to **Websites** -> Click **Manage** next to your domain.
3. In the left sidebar or dashboard, click **File Manager**.
4. Open the **`public_html`** folder for your domain.
5. (Optional) Delete the default Hostinger `default.php` placeholder file if present.
6. Upload all files and folders located **INSIDE the `dist` folder** directly into `public_html/`.
   - Your `public_html/` should contain:
     - `index.html`
     - `.htaccess`
     - `favicon.svg`
     - `assets/` (folder with CSS and JS chunks)
     - `downloads/` (folder for mobile installers if needed)

### Step 4: Verify SSL
1. In hPanel, go to **Security** -> **SSL**.
2. Make sure your free Let's Encrypt SSL certificate is active for your domain.
3. Visit your website (e.g. `https://yourdomain.com`).

---

## Method 2: Hostinger VPS (Virtual Private Server)

If you are using a Hostinger VPS with Nginx or Apache:

1. **SSH into your server:**
   ```bash
   ssh root@<your-server-ip>
   ```

2. **Clone your repository & build:**
   ```bash
   git clone <your-repo-url> /var/www/bkresearchlabs
   cd /var/www/bkresearchlabs
   npm install
   npm run build
   ```

3. **Configure Nginx site config (`/etc/nginx/sites-available/bkresearchlabs`):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /var/www/bkresearchlabs/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, no-transform";
       }
   }
   ```

4. **Enable site and restart Nginx:**
   ```bash
   ln -s /etc/nginx/sites-available/bkresearchlabs /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```
