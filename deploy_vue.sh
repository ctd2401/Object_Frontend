#!/bin/bash
set -e

# ====== Cấu hình (sửa theo project của bạn) ======
DOMAIN="your_domain"
PROJECT_DIR="/root/Object_Frontend"
DIST_DIR="$PROJECT_DIR/dist"
WEB_DIR="/var/www/frontend"


### build vue ###
echo " Building Vue Project"
cd "$PROJECT_DIR"
npm install
npm run build
# ====== Copy dist vào Nginx root ======
echo "👉 Deploying dist to $WEB_DIR ..."
sudo mkdir -p "$WEB_DIR"

# Backup cũ nếu có
if [ -d "$WEB_DIR" ] && [ "$(ls -A $WEB_DIR)" ]; then
    echo "👉 Backing up existing files..."
    sudo mv "$WEB_DIR" "${WEB_DIR}.backup.$(date +%Y%m%d-%H%M%S)"
    sudo mkdir -p "$WEB_DIR"
fi

sudo cp -r "$DIST_DIR"/* "$WEB_DIR"/
sudo chown -R www-data:www-data "$WEB_DIR"
sudo chmod -R 755 "$WEB_DIR"

# ====== Tạo Nginx config (HTTP first, HTTPS sẽ được Certbot thêm) ======
NGINX_CONF="/etc/nginx/sites-available/frontend.conf"
echo "👉 Creating Nginx config at $NGINX_CONF ..."
sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    root $WEB_DIR;
    index index.html;
    
    # Vue.js routing - phải có này cho SPA
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Static assets với cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        try_files \$uri =404;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/x-javascript
        application/xml+rss
        application/json
        image/svg+xml;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    

}
EOF

# ====== Kiểm tra UFW và mở ports ======
echo "👉 Configuring firewall (UFW)..."
if command -v ufw &> /dev/null; then
    # Kiểm tra UFW status trước
    UFW_STATUS=$(sudo ufw status | head -1)
    
    if [[ $UFW_STATUS == *"inactive"* ]]; then
        sudo ufw allow 22/tcp
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        sudo ufw --force enable
        echo "✅ UFW enabled and configured: ports 22, 80, 443 opened"
    else
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        echo "✅ UFW rules updated: ports 80, 443 opened"
    fi
    
    # Show current rules
    echo "Current UFW rules:"
    sudo ufw status numbered
else
    echo "⚠️  UFW not installed, checking iptables..."
    # Nếu dùng iptables thay vì UFW
    sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
    sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
    
    # Lưu iptables rules (Ubuntu/Debian)
    if command -v netfilter-persistent &> /dev/null; then
        sudo netfilter-persistent save
        echo "✅ iptables rules saved"
    elif command -v iptables-save &> /dev/null; then
        sudo iptables-save > /etc/iptables/rules.v4
        echo "✅ iptables rules saved to /etc/iptables/rules.v4"
    fi
fi

# ====== Kích hoạt site ======
echo "👉 Enabling Nginx site..."
# Remove existing symlinks safely
sudo rm -f /etc/nginx/sites-enabled/frontend.conf
sudo rm -f /etc/nginx/sites-enabled/default

# Create new symlink
sudo ln -s "$NGINX_CONF" /etc/nginx/sites-enabled/

# ====== Test và restart Nginx ======
echo "👉 Testing Nginx config..."
if sudo nginx -t; then
    echo "✅ Nginx config test passed"
    echo "👉 Restarting Nginx..."
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    # Wait a moment for nginx to start
    sleep 2
else
    echo "❌ Nginx config test failed!"
    exit 1
fi

# ====== Kiểm tra Nginx đang chạy ======
echo "👉 Checking Nginx status..."
if sudo systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx is not running"
    sudo systemctl status nginx --no-pager -l
    exit 1
fi

# ====== Test HTTP connection ======
echo "👉 Testing HTTP connection..."
sleep 2

# Test local connection first
LOCAL_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost || echo "000")
echo "Local test (localhost): $LOCAL_TEST"

# Test domain connection
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN || echo "000")
echo "Domain test ($DOMAIN): $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ] || [ "$LOCAL_TEST" = "200" ]; then
    echo "✅ HTTP connection working!"
else
    echo "⚠️  HTTP test failed. Checking port status..."
    echo "Ports listening:"
    sudo netstat -tlnp | grep :80
    echo ""
    echo "Nginx processes:"
    ps aux | grep nginx
    echo ""
    echo "Check nginx error log:"
    sudo tail -n 10 /var/log/nginx/error.log
fi
# ====== Cài Certbot + SSL ======
echo "👉 Installing Certbot & enabling HTTPS..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m admin@$DOMAIN

echo "✅ Deployment complete!"
echo "Truy cập: https://$DOMAIN"

# ====== Final result ======
echo ""
echo "🎉 Deployment complete!"
echo "📍 HTTP:  http://$DOMAIN"
echo "📍 Local: http://localhost"
echo ""
echo "📁 Files deployed to: $WEB_DIR"
echo "⚙️  Nginx config: $NGINX_CONF"
echo ""
echo "🔧 Useful commands:"
echo "   sudo systemctl status nginx"
echo "   sudo nginx -t"
echo "   curl -I http://$DOMAIN"
echo "   curl -I http://localhost"
echo ""
echo "📝 Log files:"
echo "   sudo tail -f /var/log/nginx/error.log"
echo "   sudo tail -f /var/log/nginx/access.log"
echo ""
echo "🔄 To redeploy: just run this script again"
