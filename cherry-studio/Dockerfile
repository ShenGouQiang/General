# -------------------------------------------------------------------------------------
# Dockerfile for Cherry Studio with Chinese Pinyin Support on Webtop
# Author: Your AI Assistant
# Version: 2.0 (Functional Milestone: Correctly handles custom startup scripts)
# -------------------------------------------------------------------------------------

# Step 1: Base Image
FROM lscr.io/linuxserver/webtop:ubuntu-xfce

# Step 2: Switch to root
USER root

# Step 3: Install dependencies (Unchanged)
RUN \
    apt-get update && \
    apt-get remove -y google-chrome-stable || true && \
    apt-get install -y --no-install-recommends \
        wget \
        locales \
        fonts-wqy-zenhei \
        fcitx \
        libfuse2 && \
    sed -i -e 's/# zh_CN.UTF-8 UTF-8/zh_CN.UTF-8 UTF-8/' /etc/locale.gen && \
    dpkg-reconfigure --frontend=noninteractive locales && \
    SOGOU_URL="https://ime-sec.gtimg.com/202508172305/a796938aeb5a95e30c7cd4879624bd09/pc/dl/gzindex/1680521603/sogoupinyin_4.2.1.145_amd64.deb" && \
    wget -O /tmp/sogou.deb "${SOGOU_URL}" && \
    dpkg -i /tmp/sogou.deb || apt-get install -f -y && \
    rm /tmp/sogou.deb && apt-get clean && rm -rf /var/lib/apt/lists/*

# Step 4: Environment Variables (Unchanged)
ENV LANG=zh_CN.UTF-8 \
    LC_ALL=zh_CN.UTF-8

# Step 5: Extract AppImage (Unchanged)
WORKDIR /opt
COPY Cherry-Studio-x86_64.AppImage .
RUN \
    chmod +x Cherry-Studio-x86_64.AppImage && \
    ./Cherry-Studio-x86_64.AppImage --appimage-extract && \
    mv squashfs-root cherry-studio && \
    rm Cherry-Studio-x86_64.AppImage

# Step 6: Create default config files in staging area (Unchanged)
# 6.1: Create directories
RUN mkdir -p /defaults/config/xdg/autostart && \
    mkdir -p /defaults/config/Desktop
# 6.2: Create Fcitx autostart file
RUN cat <<EOF > /defaults/config/xdg/autostart/fcitx.desktop
[Desktop Entry]
Type=Application
Name=Fcitx
Exec=fcitx
Terminal=false
EOF
# 6.3: Create the master Cherry Studio desktop file
RUN cat <<EOF > /defaults/config/cherry-studio.desktop
[Desktop Entry]
Type=Application
Name=Cherry Studio
Comment=Launch Cherry Studio
Exec=/opt/cherry-studio/cherrystudio --no-sandbox --disable-gpu
Icon=/opt/cherry-studio/cherrystudio.png
Terminal=false
StartupNotify=true
EOF
# 6.4: Create symbolic links
RUN ln -s /defaults/config/cherry-studio.desktop /defaults/config/xdg/autostart/cherry-studio.desktop && \
    ln -s /defaults/config/cherry-studio.desktop "/defaults/config/Desktop/Cherry Studio.desktop"

# 6.5: Chmod permission
RUN  chmod +x /defaults/config/Desktop/Cherry\ Studio.desktop && \
     chmod +x /defaults/config/cherry-studio.desktop && \
     chmod +x /defaults/config/xdg/autostart/cherry-studio.desktop

# --- THE CRITICAL FIX IS HERE ---
# Step 7: Create the custom startup script for s6-overlay

# Step 7.1: Create the cont-init.d directory first, as it may not exist in the base image build stage.
RUN mkdir -p /etc/cont-init.d

# Step 7.2: Now, safely create the custom startup script inside it.
RUN cat <<EOF > /etc/cont-init.d/99-custom-files
#!/bin/bash
# This script runs on container startup.
# It copies our default desktop/autostart files to the /config volume if they don't exist.
# Using 'cp -n' (no-clobber) ensures we don't overwrite user's potential changes.

echo "[Custom Script] Setting up Cherry Studio shortcuts..."
mkdir -p /config/xdg/autostart
mkdir -p /config/Desktop

# Copy the files if they are not already there
cp -n /defaults/config/xdg/autostart/* /config/xdg/autostart/
cp -n "/defaults/config/Desktop/Cherry Studio.desktop" "/config/Desktop/"
echo "[Custom Script] Setup complete."
EOF

# Step 7.3: Make the custom startup script executable
RUN chmod +x /etc/cont-init.d/99-custom-files

# Step 8: Configure Fcitx environment variables (Unchanged)
RUN \
    { \
        echo ''; \
        echo '# Fcitx Input Method Settings'; \
        echo 'export XMODIFIERS=@im=fcitx'; \
        echo 'export GTK_IM_MODULE=fcitx'; \
        echo 'export QT_IM_MODULE=fcitx'; \
    } >> /etc/skel/.profile

# Step 9: Switch back to default user (Unchanged)
USER abc
WORKDIR /config
